const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const con = require('./databaseConnection.js');
const decrypt= require('./decryptToken.js')
const jwt = require('jsonwebtoken');
const key = require('./tokenKey.js');
const { userInfo } = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Nouvelle connexion socket');


  // Custom event
  socket.on('message', (data) => {

  console.log('message:', data);  

  });


  // Événement de déconnexion
  socket.on('disconnect', () => {
    console.log('Déconnexion socket');
  });
});

const port = process.env.PORT || 2000;

server.listen(port, () => {
  console.log(`Serveur Socket.IO en cours d'écoute sur le port ${port}`);
});
