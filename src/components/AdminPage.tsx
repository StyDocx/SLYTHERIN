import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OrnateFrame } from './OrnateFrame';
import { ChamferButton } from './ChamferButton';
import { QrPassView, RegisteredParticipant } from './QrPassView';
import { decodeQrFromImageSource } from '../utils/qrcode';
import { adminFetch } from '../utils/adminApi';

interface ScanResponse {
  status: 'SUCCESS' | 'ALREADY_SCANNED' | 'NOT_FOUND' | 'PAYMENT_REQUIRED';
  message: string;
  registration?: RegisteredParticipant;
}

interface AdminPageProps {
  onBackToHome: () => void;
  localRegistrations: RegisteredParticipant[];
  onUpdateLocalRegistrations: (list: RegisteredParticipant[]) => void;
}

const APPS_SCRIPT_SNIPPET = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Pass ID", "Registration No", "Student Name", "Batch", "Gender",
      "Phone", "Email", "Track", "Registered Events",
      "Attendance Status", "Attendance Time", "Food Counter Status", "Food Time"
    ]);
  }
  var r = data.registration;
  if (r) {
    var values = sheet.getDataRange().getValues();
    var rowIdx = -1;
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === r.passId) { rowIdx = i + 1; break; }
    }
    var rowData = [
      r.passId, r.registrationNo, r.studentName, r.batch, r.gender,
      r.phone, r.email, r.track, (r.selectedEvents || []).join(", "),
      r.attendanceScanned ? "PRESENT" : "PENDING", r.attendanceScannedAt || "",
      r.foodScanned ? "USED (INSIDE)" : "UNUSED", r.foodScannedAt || ""
    ];
    if (rowIdx > 0) {
      sheet.getRange(rowIdx, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

export const AdminPage: React.FC<AdminPageProps> = ({
  onBackToHome,
  localRegistrations,
  onUpdateLocalRegistrations,
}) => {
  const [registrations, setRegistrations] = useState<RegisteredParticipant[]>(localRegistrations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQrRecord, setSelectedQrRecord] = useState<RegisteredParticipant | null>(null);

  /* Scanner 1: Attendance State */
  const [attInput, setAttInput] = useState('');
  const [attResult, setAttResult] = useState<ScanResponse | null>(null);
  const [attCameraActive, setAttCameraActive] = useState(false);
  const attVideoRef = useRef<HTMLVideoElement | null>(null);
  const attStreamRef = useRef<MediaStream | null>(null);

  /* Scanner 2: Food Counter State */
  const [foodInput, setFoodInput] = useState('');
  const [foodResult, setFoodResult] = useState<ScanResponse | null>(null);
  const [foodCameraActive, setFoodCameraActive] = useState(false);
  const foodVideoRef = useRef<HTMLVideoElement | null>(null);
  const foodStreamRef = useRef<MediaStream | null>(null);

  /* Google Sheets Webhook State */
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetStatus, setSheetStatus] = useState<string | null>(null);
  const [showScriptGuide, setShowScriptGuide] = useState(false);

  const fetchAllRegistrations = useCallback(async () => {
    try {
      const res = await adminFetch('/api/registrations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.registrations)) {
          setRegistrations(data.registrations);
          onUpdateLocalRegistrations(data.registrations);
        }
        if (typeof data.googleSheetWebhookUrl === 'string') {
          setSheetUrl(data.googleSheetWebhookUrl);
        }
      }
    } catch {
      // Fallback to localRegistrations
    }
  }, [onUpdateLocalRegistrations]);

  useEffect(() => {
    fetchAllRegistrations();
  }, []);

  // Stop camera streams on unmount
  useEffect(() => {
    return () => {
      if (attStreamRef.current) {
        attStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (foodStreamRef.current) {
        foodStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const performScan = useCallback(
    async (mode: 'attendance' | 'food', rawCode: string, confirmPaid: boolean = false) => {
      const trimmed = rawCode.trim();
      if (!trimmed) return;

      const endpoint = mode === 'attendance' ? '/api/scan/attendance' : '/api/scan/food';
      try {
        const res = await adminFetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: trimmed, confirmPaid }),
        });
        const data: ScanResponse = await res.json();
        if (mode === 'attendance') {
          setAttResult(data);
        } else {
          setFoodResult(data);
        }
        await fetchAllRegistrations();
        return;
      } catch {
        // Offline / local fallback scan
        const upper = trimmed.toUpperCase();
        const idx = registrations.findIndex(
          (r) =>
            r.qrPayload.toUpperCase() === upper ||
            r.passId.toUpperCase() === upper ||
            r.registrationNo.toUpperCase() === upper
        );
        if (idx === -1) {
          const notFound: ScanResponse = {
            status: 'NOT_FOUND',
            message: 'No registered participant found matching this QR Code or Registration No.',
          };
          if (mode === 'attendance') setAttResult(notFound);
          else setFoodResult(notFound);
          return;
        }
        const target = { ...registrations[idx] };

        // Check payment status on scan
        if (!target.paid && !confirmPaid) {
          const reqPaid: ScanResponse = {
            status: 'PAYMENT_REQUIRED',
            message: `PAYMENT PENDING: ${target.studentName} (${target.registrationNo}) has not paid registration fee. Confirm payment now?`,
            registration: target,
          };
          if (mode === 'attendance') setAttResult(reqPaid);
          else setFoodResult(reqPaid);
          return;
        }

        if (!target.paid && confirmPaid) {
          target.paid = true;
          target.paidAt = new Date().toISOString();
        }

        if (mode === 'attendance') {
          if (target.attendanceScanned) {
            setAttResult({
              status: 'ALREADY_SCANNED',
              message: `DUPLICATE SCAN BLOCKED: ${target.studentName} (${target.registrationNo}) has already been scanned for Attendance! One person cannot be scanned twice.`,
              registration: target,
            });
            return;
          }
          target.attendanceScanned = true;
          target.attendanceScannedAt = new Date().toISOString();
          const updated = [...registrations];
          updated[idx] = target;
          setRegistrations(updated);
          onUpdateLocalRegistrations(updated);
          setAttResult({
            status: 'SUCCESS',
            message: `ATTENDANCE RECORDED: ${target.studentName} (${target.registrationNo}) verified.`,
            registration: target,
          });
        } else {
          if (target.foodScanned) {
            setFoodResult({
              status: 'ALREADY_SCANNED',
              message: `FOOD COUNTER DENIED: ${target.studentName} (${target.registrationNo}) has already used their Food Counter pass! Cannot be scanned more than once.`,
              registration: target,
            });
            return;
          }
          target.foodScanned = true;
          target.foodScannedAt = new Date().toISOString();
          const updated = [...registrations];
          updated[idx] = target;
          setRegistrations(updated);
          onUpdateLocalRegistrations(updated);
          setFoodResult({
            status: 'SUCCESS',
            message: `FOOD COUNTER APPROVED: ${target.studentName} (${target.registrationNo}) may enter inside.`,
            registration: target,
          });
        }
      }
    },
    [fetchAllRegistrations, onUpdateLocalRegistrations, registrations]
  );

  const handleTogglePayment = useCallback(
    async (passId: string, currentPaid: boolean) => {
      const nextPaid = !currentPaid;
      const updated = registrations.map((r) =>
        r.passId === passId ? { ...r, paid: nextPaid, paidAt: nextPaid ? new Date().toISOString() : null } : r
      );
      setRegistrations(updated);
      onUpdateLocalRegistrations(updated);

      try {
        const res = await adminFetch(`/api/registrations/${passId}/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paid: nextPaid }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.registration) {
            const fresh = registrations.map((r) => (r.passId === passId ? data.registration : r));
            setRegistrations(fresh);
            onUpdateLocalRegistrations(fresh);
          }
        }
      } catch {
        fetchAllRegistrations();
      }
    },
    [fetchAllRegistrations, onUpdateLocalRegistrations, registrations]
  );

  // Camera scanning loop for Attendance Scanner
  useEffect(() => {
    if (!attCameraActive) return;
    let cancelled = false;
    const interval = setInterval(async () => {
      if (cancelled || !attVideoRef.current) return;
      if (attVideoRef.current.readyState >= 2) {
        const decoded = await decodeQrFromImageSource(attVideoRef.current);
        if (decoded && !cancelled) {
          setAttInput(decoded);
          await performScan('attendance', decoded);
          // Stop camera after successful read so it doesn't immediately re-trigger duplicate on next frame
          if (attStreamRef.current) {
            attStreamRef.current.getTracks().forEach((t) => t.stop());
            attStreamRef.current = null;
          }
          setAttCameraActive(false);
        }
      }
    }, 450);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [attCameraActive, performScan]);

  // Camera scanning loop for Food Counter Scanner
  useEffect(() => {
    if (!foodCameraActive) return;
    let cancelled = false;
    const interval = setInterval(async () => {
      if (cancelled || !foodVideoRef.current) return;
      if (foodVideoRef.current.readyState >= 2) {
        const decoded = await decodeQrFromImageSource(foodVideoRef.current);
        if (decoded && !cancelled) {
          setFoodInput(decoded);
          await performScan('food', decoded);
          if (foodStreamRef.current) {
            foodStreamRef.current.getTracks().forEach((t) => t.stop());
            foodStreamRef.current = null;
          }
          setFoodCameraActive(false);
        }
      }
    }, 450);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [foodCameraActive, performScan]);

  const toggleCamera = async (mode: 'attendance' | 'food') => {
    if (mode === 'attendance') {
      if (attCameraActive) {
        if (attStreamRef.current) {
          attStreamRef.current.getTracks().forEach((t) => t.stop());
          attStreamRef.current = null;
        }
        setAttCameraActive(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        attStreamRef.current = stream;
        setAttCameraActive(true);
        setTimeout(() => {
          if (attVideoRef.current) {
            attVideoRef.current.srcObject = stream;
            attVideoRef.current.play().catch(() => {});
          }
        }, 80);
      } catch {
        setAttResult({
          status: 'NOT_FOUND',
          message:
            'Camera access was unavailable. You can upload a QR Pass image or scan/enter the Pass ID below.',
        });
      }
    } else {
      if (foodCameraActive) {
        if (foodStreamRef.current) {
          foodStreamRef.current.getTracks().forEach((t) => t.stop());
          foodStreamRef.current = null;
        }
        setFoodCameraActive(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        foodStreamRef.current = stream;
        setFoodCameraActive(true);
        setTimeout(() => {
          if (foodVideoRef.current) {
            foodVideoRef.current.srcObject = stream;
            foodVideoRef.current.play().catch(() => {});
          }
        }, 80);
      } catch {
        setFoodResult({
          status: 'NOT_FOUND',
          message:
            'Camera access was unavailable. You can upload a QR Pass image or scan/enter the Pass ID below.',
        });
      }
    }
  };

  const handleImageUpload = async (
    mode: 'attendance' | 'food',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    // Check if filename contains Pass ID (e.g. REG123_SLY-1001_QR_Pass.png)
    const passMatch = file.name.match(/SLY-\d+/i);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      const decoded = await decodeQrFromImageSource(img);
      URL.revokeObjectURL(url);
      const finalCode = decoded || (passMatch ? passMatch[0].toUpperCase() : '');
      if (finalCode) {
        if (mode === 'attendance') setAttInput(finalCode);
        else setFoodInput(finalCode);
        await performScan(mode, finalCode);
      } else {
        const msg: ScanResponse = {
          status: 'NOT_FOUND',
          message: 'Could not decode QR from image. Please enter Pass ID or Registration No.',
        };
        if (mode === 'attendance') setAttResult(msg);
        else setFoodResult(msg);
      }
    };
    img.src = url;
  };

  const handleSaveSheetConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSheetStatus('Syncing with Google Sheet...');
    try {
      const res = await adminFetch('/api/gsheet/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleSheetWebhookUrl: sheetUrl }),
      });
      const data = await res.json();
      if (data.syncResult?.synced) {
        setSheetStatus('✓ Connected & Synced all records to Google Sheet!');
      } else if (sheetUrl.trim()) {
        setSheetStatus('✓ Webhook URL saved. Ready to push live updates to Google Sheet.');
      } else {
        setSheetStatus('Webhook cleared.');
      }
    } catch {
      setSheetStatus('Saved locally.');
    }
  };

  const totalCount = registrations.length;
  const paidCount = registrations.filter((r) => r.paid).length;
  const attCount = registrations.filter((r) => r.attendanceScanned).length;
  const foodCount = registrations.filter((r) => r.foodScanned).length;

  const filteredList = registrations.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (q === 'paid') return Boolean(r.paid);
    if (q === 'unpaid') return !r.paid;
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.registrationNo.toLowerCase().includes(q) ||
      r.passId.toLowerCase().includes(q) ||
      r.track.toLowerCase().includes(q) ||
      (r.foodPreference && r.foodPreference.toLowerCase().includes(q)) ||
      r.selectedEvents.some((ev) => ev.toLowerCase().includes(q))
    );
  });

  return (
    <div className="admin-portal">
      {/* Top Bar */}
      <div className="admin-portal__header">
        <div>
          <p className="admin-portal__eyebrow">ZENFORIANZ PRESENTS • DATABASE &amp; GATE CONTROL</p>
          <h1 className="admin-portal__title">
            Admin QR Scanners &amp; Google Sheet Registry
          </h1>
        </div>
        <div className="admin-portal__header-actions">
          <a
            href="/api/export/csv"
            download="slytherin_registrations_google_sheet.csv"
            className="admin-csv-btn"
          >
            ⬇ Export Google Sheet (.CSV)
          </a>
          <ChamferButton variant="nav" onClick={onBackToHome}>
            <span>← Back to Website</span>
          </ChamferButton>
        </div>
      </div>

      {/* Live Stats Strip */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Total Registered</span>
          <strong className="admin-stat-card__value">{totalCount}</strong>
          <span className="admin-stat-card__sub">Students in Database</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Fee Payment</span>
          <strong className="admin-stat-card__value">
            {paidCount} / {totalCount}
          </strong>
          <span className="admin-stat-card__sub">Fees Paid &amp; Verified</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Scanner 1 • Attendance</span>
          <strong className="admin-stat-card__value">
            {attCount} / {totalCount}
          </strong>
          <span className="admin-stat-card__sub">Verified Present (Single-Scan Locked)</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Scanner 2 • Food Counter</span>
          <strong className="admin-stat-card__value">
            {foodCount} / {totalCount}
          </strong>
          <span className="admin-stat-card__sub">Entered Food Hall (Single-Scan Locked)</span>
        </div>
      </div>

      {/* =================================================================
          TWO DEDICATED QR SCANNERS: 1) ATTENDANCE  2) FOOD COUNTER
          ================================================================= */}
      <div className="admin-scanners-grid">
        {/* SCANNER 1: ATTENDANCE SCANNER */}
        <OrnateFrame variant="card" className="admin-scanner-frame">
          <div className="admin-scanner-box">
            <div className="admin-scanner-box__header">
              <span className="admin-scanner-box__tag">SCANNER 01</span>
              <h2 className="admin-scanner-box__title">Attendance QR Scanner</h2>
              <p className="admin-scanner-box__desc">
                Stores Student Name, Registration No., and Registered Events in DB.{' '}
                <strong>One person cannot be scanned twice.</strong>
              </p>
            </div>

            <div className="admin-scanner-controls">
              <button
                type="button"
                className={`admin-cam-btn ${attCameraActive ? 'is-active' : ''}`}
                onClick={() => toggleCamera('attendance')}
              >
                {attCameraActive ? '⏹ Stop Camera' : '📷 Scan QR with Camera'}
              </button>

              <label className="admin-upload-btn">
                <span>🖼 Upload QR Pass Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('attendance', e)}
                />
              </label>
            </div>

            {attCameraActive && (
              <div className="admin-video-wrap">
                <video ref={attVideoRef} className="admin-video" muted playsInline />
                <div className="admin-video-reticle" />
              </div>
            )}

            <form
              className="admin-manual-form"
              onSubmit={(e) => {
                e.preventDefault();
                performScan('attendance', attInput);
              }}
            >
              <input
                type="text"
                value={attInput}
                onChange={(e) => setAttInput(e.target.value)}
                placeholder="Scan QR / Enter Pass ID (e.g. SLY-1001) or Reg. No."
                className="reg-field__input admin-manual-input"
              />
              <button type="submit" className="admin-scan-submit-btn">
                Verify Attendance
              </button>
            </form>

            {registrations.length > 0 && (
              <div className="admin-quick-pick">
                <span>Quick Test Scan:</span>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      setAttInput(e.target.value);
                      performScan('attendance', e.target.value);
                    }
                  }}
                  className="admin-quick-select"
                >
                  <option value="">Select a registered student to test scan...</option>
                  {registrations.map((r) => (
                    <option key={r.passId} value={r.qrPayload}>
                      {r.passId} — {r.studentName} ({r.registrationNo}) {r.paid ? '[Fee: Paid]' : '[Fee: UNPAID]'}{' '}
                      {r.attendanceScanned ? '[Already Scanned]' : '[Ready]'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Attendance Scan Output Card */}
            {attResult && (
              <div
                className={`admin-scan-result admin-scan-result--${attResult.status.toLowerCase()}`}
                role="status"
              >
                <div className="admin-scan-result__banner">
                  {attResult.status === 'SUCCESS' && '✓ ATTENDANCE VERIFIED & STORED IN DB'}
                  {attResult.status === 'PAYMENT_REQUIRED' && '⚠️ PAYMENT PENDING — CONFIRM PAYMENT TO PROCEED'}
                  {attResult.status === 'ALREADY_SCANNED' &&
                    '⛔ DUPLICATE SCAN BLOCKED — ALREADY ATTENDED'}
                  {attResult.status === 'NOT_FOUND' && '⚠ INVALID OR UNKNOWN QR CODE'}
                </div>
                <p className="admin-scan-result__msg">{attResult.message}</p>

                {attResult.status === 'PAYMENT_REQUIRED' && attResult.registration && (
                  <div className="admin-scan-payment-prompt">
                    <p className="admin-scan-payment-prompt__info">
                      ⚠️ <strong>Registration fee has not been paid yet.</strong> Has this student paid their fee now?
                    </p>
                    <div className="admin-scan-payment-prompt__actions">
                      <button
                        type="button"
                        className="admin-payment-confirm-btn"
                        onClick={() => performScan('attendance', attResult.registration?.qrPayload || attInput, true)}
                      >
                        ✓ Yes, Mark as Paid &amp; Approve Attendance
                      </button>
                      <button
                        type="button"
                        className="admin-payment-cancel-btn"
                        onClick={() => setAttResult(null)}
                      >
                        ✕ Deny Entry / Cancel
                      </button>
                    </div>
                  </div>
                )}

                {attResult.registration && (
                  <div className="admin-scan-result__meta">
                    <div>
                      <strong>Student Name:</strong> {attResult.registration.studentName}
                    </div>
                    <div>
                      <strong>Registration No.:</strong> {attResult.registration.registrationNo}
                    </div>
                    <div>
                      <strong>Pass ID:</strong> {attResult.registration.passId}
                    </div>
                    <div>
                      <strong>Payment:</strong>{' '}
                      <span className={`admin-payment-badge ${attResult.registration.paid ? 'is-paid' : 'is-unpaid'}`}>
                        {attResult.registration.paid ? '✓ PAID' : '⏳ UNPAID'}
                      </span>
                    </div>
                    <div>
                      <strong>Track:</strong> {attResult.registration.track}
                    </div>
                    <div>
                      <strong>Food Option:</strong>{' '}
                      <span className={attResult.registration.foodPreference === 'Non-Veg' ? 'badge-nonveg' : 'badge-veg'}>
                        {attResult.registration.foodPreference === 'Non-Veg' ? '🍗 NON-VEG' : '🥬 VEG'}
                      </span>
                    </div>
                    <div className="admin-scan-result__events">
                      <strong>Registered Events:</strong>{' '}
                      {attResult.registration.selectedEvents.join(', ')}
                    </div>
                    {attResult.registration.attendanceScannedAt && (
                      <div>
                        <strong>Recorded At:</strong>{' '}
                        {new Date(attResult.registration.attendanceScannedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </OrnateFrame>

        {/* SCANNER 2: FOOD COUNTER SCANNER */}
        <OrnateFrame variant="card" className="admin-scanner-frame">
          <div className="admin-scanner-box">
            <div className="admin-scanner-box__header">
              <span className="admin-scanner-box__tag">SCANNER 02</span>
              <h2 className="admin-scanner-box__title">Food Counter QR Scanner</h2>
              <p className="admin-scanner-box__desc">
                Grants entry inside the Food Counter upon scan.{' '}
                <strong>Cannot be scanned more than once per participant.</strong>
              </p>
            </div>

            <div className="admin-scanner-controls">
              <button
                type="button"
                className={`admin-cam-btn ${foodCameraActive ? 'is-active' : ''}`}
                onClick={() => toggleCamera('food')}
              >
                {foodCameraActive ? '⏹ Stop Camera' : '📷 Scan QR with Camera'}
              </button>

              <label className="admin-upload-btn">
                <span>🖼 Upload QR Pass Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('food', e)}
                />
              </label>
            </div>

            {foodCameraActive && (
              <div className="admin-video-wrap">
                <video ref={foodVideoRef} className="admin-video" muted playsInline />
                <div className="admin-video-reticle" />
              </div>
            )}

            <form
              className="admin-manual-form"
              onSubmit={(e) => {
                e.preventDefault();
                performScan('food', foodInput);
              }}
            >
              <input
                type="text"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                placeholder="Scan QR / Enter Pass ID (e.g. SLY-1001) or Reg. No."
                className="reg-field__input admin-manual-input"
              />
              <button type="submit" className="admin-scan-submit-btn">
                Verify Food Entry
              </button>
            </form>

            {registrations.length > 0 && (
              <div className="admin-quick-pick">
                <span>Quick Test Scan:</span>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      setFoodInput(e.target.value);
                      performScan('food', e.target.value);
                    }
                  }}
                  className="admin-quick-select"
                >
                  <option value="">Select a registered student to test scan...</option>
                  {registrations.map((r) => (
                    <option key={r.passId} value={r.qrPayload}>
                      {r.passId} — {r.studentName} ({r.registrationNo}) {r.paid ? '[Fee: Paid]' : '[Fee: UNPAID]'} [{r.foodPreference || 'Veg'}]{' '}
                      {r.foodScanned ? '[Food Already Used]' : '[Ready for Food]'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Food Counter Scan Output Card */}
            {foodResult && (
              <div
                className={`admin-scan-result admin-scan-result--${foodResult.status.toLowerCase()}`}
                role="status"
              >
                <div className="admin-scan-result__banner">
                  {foodResult.status === 'SUCCESS' &&
                    '✓ FOOD COUNTER APPROVED — ALLOW ENTRY INSIDE'}
                  {foodResult.status === 'PAYMENT_REQUIRED' &&
                    '⚠️ PAYMENT PENDING — CONFIRM PAYMENT TO PROCEED'}
                  {foodResult.status === 'ALREADY_SCANNED' &&
                    '⛔ FOOD PASS ALREADY USED — ENTRY DENIED'}
                  {foodResult.status === 'NOT_FOUND' && '⚠ INVALID OR UNKNOWN QR CODE'}
                </div>
                <p className="admin-scan-result__msg">{foodResult.message}</p>

                {foodResult.status === 'PAYMENT_REQUIRED' && foodResult.registration && (
                  <div className="admin-scan-payment-prompt">
                    <p className="admin-scan-payment-prompt__info">
                      ⚠️ <strong>Registration fee has not been paid yet.</strong> Has this student paid their fee now?
                    </p>
                    <div className="admin-scan-payment-prompt__actions">
                      <button
                        type="button"
                        className="admin-payment-confirm-btn"
                        onClick={() => performScan('food', foodResult.registration?.qrPayload || foodInput, true)}
                      >
                        ✓ Yes, Mark as Paid &amp; Grant Food Pass
                      </button>
                      <button
                        type="button"
                        className="admin-payment-cancel-btn"
                        onClick={() => setFoodResult(null)}
                      >
                        ✕ Deny Entry / Cancel
                      </button>
                    </div>
                  </div>
                )}

                {foodResult.registration && (
                  <div className="admin-scan-result__meta">
                    <div>
                      <strong>Student Name:</strong> {foodResult.registration.studentName}
                    </div>
                    <div>
                      <strong>Registration No.:</strong> {foodResult.registration.registrationNo}
                    </div>
                    <div>
                      <strong>Pass ID:</strong> {foodResult.registration.passId}
                    </div>
                    <div>
                      <strong>Payment:</strong>{' '}
                      <span className={`admin-payment-badge ${foodResult.registration.paid ? 'is-paid' : 'is-unpaid'}`}>
                        {foodResult.registration.paid ? '✓ PAID' : '⏳ UNPAID'}
                      </span>
                    </div>
                    <div>
                      <strong>Track:</strong> {foodResult.registration.track}
                    </div>
                    <div>
                      <strong>Food Option:</strong>{' '}
                      <span className={foodResult.registration.foodPreference === 'Non-Veg' ? 'badge-nonveg' : 'badge-veg'}>
                        {foodResult.registration.foodPreference === 'Non-Veg' ? '🍗 NON-VEG' : '🥬 VEG'}
                      </span>
                    </div>
                    {foodResult.registration.foodScannedAt && (
                      <div>
                        <strong>Food Counter Scanned At:</strong>{' '}
                        {new Date(foodResult.registration.foodScannedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </OrnateFrame>
      </div>

      {/* =================================================================
          GOOGLE SHEETS SYNC & WEBHOOK INTEGRATION PANEL
          ================================================================= */}
      <div className="admin-gsheet-panel">
        <div className="admin-gsheet-panel__top">
          <div>
            <h2 className="admin-scanner-box__title">Google Sheets Live Integration</h2>
            <p className="admin-scanner-box__desc">
              Automatically sync every registration, Attendance scan, and Food Counter scan to a
              Google Sheet in real time, or export the full spreadsheet as a Google Sheets `.CSV`.
            </p>
          </div>
          <div className="admin-gsheet-actions">
            <button
              type="button"
              className="reg-back-btn"
              onClick={() => setShowScriptGuide((prev) => !prev)}
            >
              {showScriptGuide ? 'Hide Google Apps Script Code ▲' : 'View Google Apps Script Setup ▼'}
            </button>
            <a
              href="/api/export/csv"
              download="slytherin_registrations_google_sheet.csv"
              className="admin-csv-btn"
            >
              ⬇ Download Google Sheet CSV
            </a>
          </div>
        </div>

        <form className="admin-gsheet-form" onSubmit={handleSaveSheetConfig}>
          <input
            type="url"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="Paste Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)"
            className="reg-field__input admin-manual-input"
          />
          <button type="submit" className="admin-scan-submit-btn">
            Save &amp; Sync to Google Sheet
          </button>
        </form>

        {sheetStatus && <p className="admin-gsheet-status">{sheetStatus}</p>}

        {showScriptGuide && (
          <div className="admin-script-guide">
            <p className="reg-helper-note">
              1. Open your Google Sheet → <strong>Extensions → Apps Script</strong>.<br />
              2. Paste the script below, click <strong>Deploy → New deployment → Web app</strong>{' '}
              (Execute as: <em>Me</em>, Who has access: <em>Anyone</em>), and paste the Web App URL
              above:
            </p>
            <pre className="admin-script-pre">{APPS_SCRIPT_SNIPPET}</pre>
          </div>
        )}
      </div>

      {/* =================================================================
          LIVE DATABASE REGISTRY TABLE
          ================================================================= */}
      <div className="admin-db-section">
        <div className="admin-db-section__header">
          <h2 className="admin-scanner-box__title">
            Registered Participants Database ({filteredList.length})
          </h2>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Reg. No., Pass ID, or Event..."
            className="reg-field__input admin-search-input"
          />
        </div>

        {filteredList.length === 0 ? (
          <p className="admin-empty-note">
            No registrations in database yet. Register a student from the homepage to generate a QR
            code pass and test the Attendance &amp; Food Counter scanners!
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pass ID &amp; QR</th>
                  <th>Student Name</th>
                  <th>Reg. No.</th>
                  <th>Batch / Gender / Food</th>
                  <th>Fee Payment</th>
                  <th>Track &amp; Registered Events</th>
                  <th>Attendance Scanner</th>
                  <th>Food Counter Scanner</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((r) => (
                  <tr key={r.passId}>
                    <td>
                      <div className="admin-td-pass">
                        <strong>{r.passId}</strong>
                        <button
                          type="button"
                          className="admin-mini-btn"
                          onClick={() => setSelectedQrRecord(r)}
                        >
                          View QR
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>{r.studentName}</strong>
                      <div className="admin-td-sub">{r.phone}</div>
                    </td>
                    <td>{r.registrationNo}</td>
                    <td>
                      <div>{r.batch} • {r.gender}</div>
                      <div style={{ marginTop: '4px' }}>
                        <span className={r.foodPreference === 'Non-Veg' ? 'badge-nonveg' : 'badge-veg'}>
                          {r.foodPreference === 'Non-Veg' ? '🍗 Non-Veg' : '🥬 Veg'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <label
                        className="admin-payment-checker"
                        title={r.paid ? 'Fee Confirmed Paid (Click to change)' : 'Fee Unpaid (Click to mark as paid)'}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(r.paid)}
                          onChange={() => handleTogglePayment(r.passId, Boolean(r.paid))}
                          className="admin-payment-checkbox"
                        />
                        <span className={`admin-payment-badge ${r.paid ? 'is-paid' : 'is-unpaid'}`}>
                          {r.paid ? '✓ PAID' : '⏳ UNPAID'}
                        </span>
                      </label>
                    </td>
                    <td>
                      <span className="admin-track-tag">{r.track}</span>
                      <div className="admin-td-events">{r.selectedEvents.join(', ')}</div>
                    </td>
                    <td>
                      {r.attendanceScanned ? (
                        <div className="admin-status-pill admin-status-pill--ok">
                          <span>✓ PRESENT</span>
                          {r.attendanceScannedAt && (
                            <small>
                              {new Date(r.attendanceScannedAt).toLocaleTimeString()}
                            </small>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="admin-mini-btn admin-mini-btn--action"
                          onClick={() => performScan('attendance', r.qrPayload)}
                        >
                          Scan Attendance
                        </button>
                      )}
                    </td>
                    <td>
                      {r.foodScanned ? (
                        <div className="admin-status-pill admin-status-pill--ok">
                          <span>✓ INSIDE (USED)</span>
                          {r.foodScannedAt && (
                            <small>{new Date(r.foodScannedAt).toLocaleTimeString()}</small>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="admin-mini-btn admin-mini-btn--action"
                          onClick={() => performScan('food', r.qrPayload)}
                        >
                          Scan Food Entry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal to View / Download Any Participant's QR Code Pass */}
      {selectedQrRecord && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedQrRecord(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-dialog modal-dialog--wide"
          >
            <OrnateFrame variant="card">
              <div className="modal-dialog__body">
                <div className="modal-dialog__header">
                  <h2 className="modal-dialog__title">
                    Participant QR Code Pass — {selectedQrRecord.studentName}
                  </h2>
                  <button
                    type="button"
                    className="modal-dialog__close"
                    onClick={() => setSelectedQrRecord(null)}
                  >
                    ×
                  </button>
                </div>
                <QrPassView
                  record={selectedQrRecord}
                  onClose={() => setSelectedQrRecord(null)}
                />
              </div>
            </OrnateFrame>
          </div>
        </div>
      )}
    </div>
  );
};

