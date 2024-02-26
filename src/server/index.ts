import cookieParser from "cookie-parser";
import express from "express";
import path from "node:path";

import proxyRouter from "./routes/proxy";

const __homedir = process.env.NODE_ENV === "development" ? path.join(__dirname, "..") : __dirname;

var expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(cookieParser());
expressApp.use(express.static(path.join(__homedir)));

expressApp.use("/proxy", proxyRouter);

expressApp.get("*", (req, res) => {
    res.sendFile(path.join(__homedir, "index.html"));
});

export default expressApp;
