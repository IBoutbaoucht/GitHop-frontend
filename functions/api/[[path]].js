const API_BASE_URL = "http://51.107.0.46";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = API_BASE_URL + url.pathname.replace("/api", "") + url.search;

  const init = {
    method: context.request.method,
    headers: context.request.headers,
    body: ["GET", "HEAD"].includes(context.request.method)
      ? undefined
      : await context.request.clone().arrayBuffer(),
  };

  const resp = await fetch(target, init);

  // Clone headers, but remove security headers that can break browser
  const headers = new Headers(resp.headers);
  headers.delete("content-security-policy");
  headers.delete("x-frame-options");

  return new Response(resp.body, {
    status: resp.status,
    headers: headers,
  });
}
