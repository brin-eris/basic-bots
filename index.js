const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');
const data_path = path.join(__dirname, './data');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(requestHandler);


io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('save_bot', function(data) {
          console.log('save:');
        console.log(data);
          let file_name = path.join(data_path, 'bot: ' + Date.now());
          fs.writeFile(file_name, data, function(){});
    });


    client.on('load_bots', function(data) {
          console.log('loading:');

          //let file_name = path.join(data_path, 'bot: ' + Date.now());
          fs.readdir(data_path, function(){
            
          });
        });
      });

// io.on('save_bot', function(data){
//   let file_name = 'bot: ' + Date.now();
//   fs.writeFile(file, data, function(){})
// });
