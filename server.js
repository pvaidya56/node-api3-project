const express = require('express');

const usersRouter = require("./users/userRouter");
const postsRouter = require("./posts/postRouter");

const server = express();

server.use(express.json());
server.use(logger); 

server.get('/', (req, res) => {
  res.status(200).json({
    message: process.env.SECRET_MESSAGE || "Welcome",
  })
  
});

server.use("/api/users", usersRouter)
//custom middleware

function logger(req, res, next) {
  const { ip, method, url} = req;

  console.log(`${ip} ${method} ${url}`)
  next(); //to pass control to the next middleware function
}

module.exports = server;
