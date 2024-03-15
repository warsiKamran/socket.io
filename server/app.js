import express from "express";
import {Server} from "socket.io";
import {createServer} from "http";
import cors from "cors";

const PORT = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    })
);


app.get("/", (req, res) => {
    res.send("hello, websocket here");
});


io.on("connection", (socket) => {

    console.log("User connected");
    console.log("Id", socket.id);

    socket.on("message", ({room, message}) => {
        console.log({room, message}); 
        io.to(room).emit("receive-message", message);
    });

    socket.join("join-room", (room) => {
        socket.join(room);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    });
});


server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});




//socket.emit -> ek particular socket ko jayega
//socket.emit.broadcast -> jisne msg bheja hai uske alawa sabke paas jayega
