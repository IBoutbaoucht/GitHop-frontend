export async function onRequest(context) {
    const url = new URL(context.request.url);

    const destinationURL = "http://51.107.0.46" + url.pathname + url.search;

    const init = {
        method: context.request.method,
        headers: context.request.headers,
        body: ['GET', 'HEAD'].includes(context.request.method)
            ? undefined
            : await context.request.clone().arrayBuffer(),
    };

    const resp = await fetch(destinationURL, init);

    return new Response(resp.body, {
        status: resp.status,
        headers: resp.headers
    });
}
