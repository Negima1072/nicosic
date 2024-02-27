import express from "express";
import fetch, { Headers } from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import { CookieAgent, HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

type globalThis = typeof globalThis & {
    cookieJar: CookieJar;
    httpAgent: CookieAgent<HttpAgent>;
    httpsAgent: CookieAgent<HttpsAgent>;
};
declare const global: globalThis;

if (typeof global.cookieJar === 'undefined') {
    global.cookieJar = new CookieJar();
}
if (typeof global.httpAgent === 'undefined') {
    global.httpAgent = new HttpCookieAgent({ cookies: {jar: global.cookieJar} });
}
if (typeof global.httpsAgent === 'undefined') {
    global.httpsAgent = new HttpsCookieAgent({ cookies: {jar: global.cookieJar} });
}

const router = express.Router();

router.get("/", (req, res) => {
    const url = req.query.url as string;
    if (!url) {
        res.status(400).send({ error: "url is required" });
        return;
    }
    const reqHeaders = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        reqHeaders.set(key, value as string);
    }
    reqHeaders.set('host', new URL(url).host);
    reqHeaders.set('referer', url);
    reqHeaders.delete('x-forwarded-for');
    reqHeaders.delete('x-forwarded-host');
    reqHeaders.delete('x-forwarded-proto');
    reqHeaders.delete('x-forwarded-port');
    fetch(url, {
        method: 'GET',
        headers: reqHeaders,
        agent: ({ protocol }) => protocol === 'https:' ? global.httpsAgent : global.httpAgent
    }).then(async (response) => {
        if (response.body) {
            for (const [key, value] of response.headers) {
                if (key === 'content-type') {
                    res.setHeader(key, value);
                }
            }
            if (response.headers.get('content-type')?.includes('application/vnd.apple.mpegurl')) {
                res.status(response.status);
                const body = await response.text();
                const nextText = body.replace(/(https?:\/\/[\w!?/+\-_~=;.,*&@#$%()'[\]]+)/g, (p0, p1) => {
                    return "/proxy?url="+encodeURIComponent(p1);
                });
                res.send(nextText);
            } else {
                response.body.pipe(res);
            }
        } else {
            res.status(response.status).end();
        }
    }
    ).catch((error) => {
        res.status(500).send({ error: error.message });
    });
});

router.post("/", (req, res) => {
    const url = req.query.url as string;
    if (!url) {
        res.status(400).send({ error: "url is required" });
        return;
    }
    const reqHeaders = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        reqHeaders.set(key, value as string);
    }
    reqHeaders.set('host', new URL(url).host);
    reqHeaders.set('referer', url);
    reqHeaders.delete('x-forwarded-for');
    reqHeaders.delete('x-forwarded-host');
    reqHeaders.delete('x-forwarded-proto');
    reqHeaders.delete('x-forwarded-port');
    fetch(url, {
        method: 'POST',
        headers: reqHeaders,
        body: req.body,
        agent: ({ protocol }) => protocol === 'https:' ? global.httpsAgent : global.httpAgent
    }).then(async (response) => {
        // proxy the response
        res.status(response.status);
        for (const [key, value] of response.headers) {
            res.setHeader(key, value);
        }
        if (response.body) {
            response.body.pipe(res);
        } else {
            res.end();
        }
    }
    ).catch((error) => {
        res.status(500).send({ error: error.message });
    });
});

export default router;
