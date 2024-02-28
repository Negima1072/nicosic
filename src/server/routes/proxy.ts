import express from "express";
import fetch, { Headers } from "node-fetch";
import globalVal from "../../global";

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
    reqHeaders.set("host", new URL(url).host);
    reqHeaders.set("origin", "https://www.nicovideo.jp");
    reqHeaders.set("referer", "https://www.nicovideo.jp/");
    reqHeaders.delete("x-forwarded-for");
    reqHeaders.delete("x-forwarded-host");
    reqHeaders.delete("x-forwarded-proto");
    reqHeaders.delete("x-forwarded-port");
    fetch(url, {
        method: "GET",
        headers: reqHeaders,
        agent: ({ protocol }) => (protocol === "https:" ? globalVal.httpsAgent : globalVal.httpAgent),
    })
        .then(async (response) => {
            if (response.body) {
                for (const [key, value] of response.headers) {
                    if (key === "content-type") {
                        res.setHeader(key, value);
                    }
                }
                if (response.headers.get("content-type")?.includes("application/vnd.apple.mpegurl")) {
                    res.status(response.status);
                    const body = await response.text();
                    const nextText = body.replace(/(https?:\/\/[\w!?/+\-_~=;.,*&@#$%()'[\]]+)/g, (p0, p1) => {
                        return "/proxy?url=" + encodeURIComponent(p1);
                    });
                    res.send(nextText);
                } else {
                    response.body.pipe(res);
                }
            } else {
                res.status(response.status).end();
            }
        })
        .catch((error) => {
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
    reqHeaders.set("host", new URL(url).host);
    reqHeaders.set("origin", "https://www.nicovideo.jp");
    reqHeaders.set("referer", "https://www.nicovideo.jp/");
    reqHeaders.delete("x-forwarded-for");
    reqHeaders.delete("x-forwarded-host");
    reqHeaders.delete("x-forwarded-proto");
    reqHeaders.delete("x-forwarded-port");
    fetch(url, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(req.body),
        agent: ({ protocol }) => (protocol === "https:" ? globalVal.httpsAgent : globalVal.httpAgent),
    })
        .then(async (response) => {
            if (response.body) {
                for (const [key, value] of response.headers) {
                    if (key === "content-type") {
                        res.setHeader(key, value);
                    }
                }
                response.body.pipe(res);
            } else {
                res.status(response.status).end();
            }
        })
        .catch((error) => {
            res.status(500).send({ error: error.message });
        });
});

export default router;
