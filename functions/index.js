const API_BASE_URL = 'http://51.107.0.46';

export async function onRequest(context) {
    const url = new URL(context.request.url);

    if (url.pathname.startsWith('/api')) {

        const destinationURL = API_BASE_URL + url.pathname + url.search;

        // Clone request properly!
        const init = {
            method: context.request.method,
            headers: context.request.headers,
            body: ['GET', 'HEAD'].includes(context.request.method)
                ? undefined
                : await context.request.clone().arrayBuffer(),
            redirect: 'follow'
        };

        return fetch(destinationURL, init);
    }

    return context.next();
}
