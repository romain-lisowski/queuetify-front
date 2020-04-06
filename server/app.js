var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

// eslint-disable-next-line no-unused-vars
io.on("connection", socket => {
  console.log("Connected : ", socket.id);
  socket.on("disconnect", () => {
    console.log("Disconnected : ", socket.id);
  });

  socket.on("E_VOTE_TRACK", () => {
    console.log("E_VOTE_TRACK : ", socket.id);
    io.emit("VOTE_TRACK");
  });

  socket.on("E_ADD_TRACK", () => {
    console.log("E_ADD_TRACK : ", socket.id);
    io.emit("ADD_TRACK");
  });

  socket.on("E_NEXT_TRACK", data => {
    console.log("E_NEXT_TRACK : " + socket.id, data);
    io.emit("NEXT_TRACK", data);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
