import React, { useMemo } from 'react';
import { generateQrMatrix, renderQrPassPngDataUrl } from '../utils/qrcode';
import { ChamferButton } from './ChamferButton';
import { DocumentBrochureIcon } from './IconSet';

export interface RegisteredParticipant {
  passId: string;
  qrPayload: string;
  studentName: string;
  registrationNo: string;
  batch: string;
  gender: 'Male' | 'Female';
  foodPreference?: 'Veg' | 'Non-Veg';
  phone: string;
  email: string;
  track: 'Cultural Event' | 'Olympia Event';
  selectedEvents: string[];
  signature: string;
  date: string;
  createdAt: string;
  attendanceScanned: boolean;
  attendanceScannedAt: string | null;
  foodScanned: boolean;
  foodScannedAt: string | null;
  paid?: boolean;
  paidAt?: string | null;
  paidBy?: string | null;
}

interface QrPassViewProps {
  record: RegisteredParticipant;
  onRegisterAnother?: () => void;
  onOpenAdmin?: () => void;
  onClose?: () => void;
}

export const QrPassView: React.FC<QrPassViewProps> = ({
  record,
  onRegisterAnother,
  onOpenAdmin,
  onClose,
}) => {
  const matrix = useMemo(() => generateQrMatrix(record.qrPayload), [record.qrPayload]);
  const quiet = 4;
  const totalSize = matrix.length + quiet * 2;

  const handleDownloadPng = () => {
    const dataUrl = renderQrPassPngDataUrl({
      qrPayload: record.qrPayload,
      passId: record.passId,
      studentName: record.studentName,
      registrationNo: record.registrationNo,
      track: record.track,
      eventsCount: record.selectedEvents.length,
    });
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${record.registrationNo}_${record.passId}_QR_Pass.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reg-confirmation">
      <div className="reg-confirmation__top-row">
        <div className="reg-confirmation__badge">
          OFFICIAL QR ENTRY PASS • {record.track.toUpperCase()}
        </div>
        <span className="reg-pass-id-pill">PASS ID: {record.passId}</span>
      </div>

      <div className="qr-pass-layout">
        {/* Left: Scannable ISO/IEC 18004 QR Code Box */}
        <div className="qr-pass-card">
          <div className="qr-pass-card__svg-wrap" title={`QR Payload: ${record.qrPayload}`}>
            <svg
              viewBox={`0 0 ${totalSize} ${totalSize}`}
              shapeRendering="crispEdges"
              className="qr-pass-card__svg"
              role="img"
              aria-label={`QR Code for ${record.studentName} (${record.registrationNo})`}
            >
              <rect width={totalSize} height={totalSize} fill="#FFFFFF" />
              {matrix.map((row, r) =>
                row.map((dark, c) =>
                  dark ? (
                    <rect
                      key={`${r}-${c}`}
                      x={c + quiet}
                      y={r + quiet}
                      width={1}
                      height={1}
                      fill="#051A13"
                    />
                  ) : null
                )
              )}
            </svg>
          </div>
          <p className="qr-pass-card__code">{record.qrPayload}</p>
          <p className="qr-pass-card__hint">
            Valid for 1 Attendance Scan &amp; 1 Food Counter Scan
          </p>
          <button
            type="button"
            className="qr-download-btn"
            onClick={handleDownloadPng}
          >
            ⬇ Download QR Pass (PNG)
          </button>
        </div>

        {/* Right: Participant & Event Details */}
        <div className="qr-pass-details">
          <div className="reg-summary-table">
            <div className="reg-summary-cell">
              <span className="reg-summary-label">Student Name</span>
              <span className="reg-summary-val">{record.studentName}</span>
            </div>
            <div className="reg-summary-cell">
              <span className="reg-summary-label">Registration No.</span>
              <span className="reg-summary-val">{record.registrationNo}</span>
            </div>
            <div className="reg-summary-cell">
              <span className="reg-summary-label">Batch &amp; Gender</span>
              <span className="reg-summary-val">
                {record.batch} • {record.gender}
              </span>
            </div>
            <div className="reg-summary-cell">
              <span className="reg-summary-label">Food Preference</span>
              <span className="reg-summary-val">
                {record.foodPreference === 'Non-Veg' ? '🍗 Non-Veg' : '🥬 Pure Veg'}
              </span>
            </div>
            <div className="reg-summary-cell">
              <span className="reg-summary-label">Phone Number</span>
              <span className="reg-summary-val">{record.phone}</span>
            </div>
            <div className="reg-summary-cell">
              <span className="reg-summary-label">E-mail ID</span>
              <span className="reg-summary-val">{record.email}</span>
            </div>
            <div className="reg-summary-cell">
              <span className="reg-summary-label">Pass Status</span>
              <span className="reg-summary-val">
                Att: {record.attendanceScanned ? '✓ Scanned' : 'Ready'} | Food:{' '}
                {record.foodScanned ? '✓ Used' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="reg-selected-box">
            <h3 className="reg-section-heading">
              Registered {record.track}s ({record.selectedEvents.length})
            </h3>
            <div className="reg-selected-tags">
              {record.selectedEvents.map((ev) => (
                <span key={ev} className="reg-selected-tag">
                  ✓ {ev}
                </span>
              ))}
            </div>
          </div>

          <div className="reg-summary-footer">
            <span>
              <strong>Signature:</strong> {record.signature}
            </span>
            <span>
              <strong>Date:</strong> {record.date}
            </span>
          </div>
        </div>
      </div>

      <div className="modal-form__actions modal-form__actions--split">
        <div className="reg-action-group">
          {onRegisterAnother && (
            <button
              type="button"
              className="reg-back-btn"
              onClick={onRegisterAnother}
            >
              ← Register Another Track
            </button>
          )}
          {onOpenAdmin && (
            <button
              type="button"
              className="reg-back-btn"
              onClick={onOpenAdmin}
            >
              Open Admin QR Scanners →
            </button>
          )}
        </div>
        <div className="reg-action-group">
          <ChamferButton variant="secondary" onClick={() => window.print()}>
            <DocumentBrochureIcon />
            <span>Print Pass</span>
          </ChamferButton>
          {onClose && (
            <ChamferButton variant="nav" onClick={onClose}>
              <span>Done</span>
            </ChamferButton>
          )}
        </div>
      </div>
    </div>
  );
};

