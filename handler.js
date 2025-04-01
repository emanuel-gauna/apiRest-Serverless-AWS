import serverless from "serverless-http";
import express from "express";
import app from "./src/app.js";


export const main = serverless(app);
