const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')

const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/router')
const restricted = require('../auth/restricted-middleware')

const server = express();

const sessionConfig = {
  name: "monster",
  secret: process.env.COOKIE_SECRET || 'saoifjiafj10923i0129i0a',
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour in miliseconds 1000 is 1 second
    secure: false, // true in production to send ONLY over https
    httpOnly: true, // true means no access from JS (ALWAYS SET TO TRUE)
  },
  resave: false,
  saveUninitialized: true
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))

server.use("/api/users", restricted, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
