import { Agent as HttpAgent } from "http";
import { CookieAgent, HttpCookieAgent, HttpsCookieAgent } from "http-cookie-agent/http";
import { Agent as HttpsAgent } from "https";
import { CookieJar } from "tough-cookie";

type globalValT = {
    cookieJar?: CookieJar;
    httpAgent?: CookieAgent<HttpAgent>;
    httpsAgent?: CookieAgent<HttpsAgent>;
};

const globalVal: globalValT = {};

if (typeof globalVal.cookieJar === "undefined") {
    globalVal.cookieJar = new CookieJar();
}
if (typeof globalVal.httpAgent === "undefined") {
    globalVal.httpAgent = new HttpCookieAgent({ cookies: { jar: globalVal.cookieJar } });
}
if (typeof globalVal.httpsAgent === "undefined") {
    globalVal.httpsAgent = new HttpsCookieAgent({ cookies: { jar: globalVal.cookieJar } });
}

export default globalVal;
