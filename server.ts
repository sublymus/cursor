import cors from "cors";
import express from "express";
import path from "path";

import { Server } from "socket.io";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIZTd6PxuO4cJEKU2aM0sSzRifGGdnI4Y",
  authDomain: "cursor-5b216.firebaseapp.com",
  projectId: "cursor-5b216",
  storageBucket: "cursor-5b216.appspot.com",
  messagingSenderId: "975659464841",
  appId: "1:975659464841:web:8d07bc8b1f785adc11ee58",
  measurementId: "G-RK3X2WZ7LC"
};
const PORT =  8080;





// Initialize Firebase
const app2 = initializeApp(firebaseConfig);
const analytics = getAnalytics(app2);


const app = express();
const server = app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});

app.use(cors());

let users = {};
const io = new Server(server , {
  cors:{
    origin :"*",
    methods:["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  users[socket.id] = {
    color:{
      r:Math.floor(Math.random()*255),
      g:Math.floor(Math.random()*255),
      b:Math.floor(Math.random()*255)
    },
    socketId: socket.id,
    id: Date.now(),
    position: { x: 0, y: 0 },
  };

  io.emit("server:userCreate", users[socket.id]);
  socket.on("client:position", (data) => {
    users[socket.id].position.x = data.x;
    users[socket.id].position.y = data.y;

    io.emit("server:userPosition", users);
    console.log(data);
  });

  socket.on("disconnect", () => {
    io.emit("server:userDestroy", users[socket.id]);
    console.log("client is disconnect", users[socket.id]);
    delete users[socket.id];
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
