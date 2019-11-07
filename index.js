var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var fs = require('fs');
var privateKey = fs.readFileSync(__dirname + '/certs/privkey.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/certs/fullchain.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };

//var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
//httpServer.listen(8099);
httpsServer.listen(8443);

var io = require('socket.io').listen(httpsServer);

var connections = [];

const AVAILABLE = 0;
const BUSY = 1;
const ONCALL = 2;

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
})


io.off('/news', () => console.log('Got connection'));

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('login', (data) => {
    if (!socket.name) {
      if (data.id) {
        socket.id = data.id;
        socket.name = data.name || '';
        socket.peerNumber = 0;
        socket.status = AVAILABLE;
        connections.push(socket);
        connections.map(c => console.log('connected=>', c.name));
        socket.emit('registered', { status: 'success', msg: 'Successfully registered' })
      } else {
        socket.emit('failed', { status: 'failed', msg: 'Invalid ID field' })
      }
    } else {
      socket.emit('registered', { status: 'success', msg: 'Already registered' })
    }
  });

  socket.on('disconnect', () => {
    //connections.map(c => console.log('disconnected', c.name));
    connections = connections.filter(conn => conn.id != socket.id);
  });

  socket.on('call', number => {
    socket.status = BUSY;
    let peer = connections.find(sck => sck.id == number);
    if (peer) {
      if (peer.status == AVAILABLE) {
        peer.peerNumber = socket.id;
        socket.peerNumber = peer.id;
        peer.emit('calling', { number: socket.id, name: socket.name });
        socket.emit('ringing', { number: peer.id, name: peer.name });
      } else {
        if (peer.status == BUSY) {
          socket.emit('busy', '')
        } else {
          socket.emit('oncall', '')
        }
      }
    } else {
      console.log('Not Found');
      socket.emit('offline', '')
    }
  });

  socket.on('desc', data => {
    let peer = connections.find(sck => sck.id == socket.peerNumber);
    if (peer) {
      peer.emit('desc', { desc: data.desc });
    } else {
      console.log('Not Found');
    }
  });
  socket.on('onice', data => {
    let peer = connections.find(sck => sck.id == socket.peerNumber);
    if (peer) {
      peer.emit('candidate', { candidate: data.candidate });
    } else {
      console.log('Not Found');
    }
  })
})
