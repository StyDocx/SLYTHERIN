/** Same-origin fetch for admin APIs. Sends the HttpOnly session cookie; bounces to login on 401. */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(input, { credentials: 'same-origin', ...init });
  if (res.status === 401) {
    const current = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    if (current !== '/admin/login') {
      window.location.replace('/admin/login');
    }
  }
  return res;
}

