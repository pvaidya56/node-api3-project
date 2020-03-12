const express = require('express');

const server = express();

server.use(express.json());
server.use(logger); 

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const { ip, method, url} = req;

  console.log(`${ip} ${method} ${url}`)
  next(); //to pass control to the next middleware function
}

module.exports = server;
