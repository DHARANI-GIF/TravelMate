import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app, { isAuthenticated } from "./middleware/middleware.js";
import locationRouter from "./routes/locations.router.js";
import authRouter from "./routes/auth.router.js";
import usersRouter from "./routes/users.router.js";
import { Server } from "socket.io";
import tripsService from "./services/trips.service.js";
import http from "http";
import sockets from "./utils/sockets.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const port = 3000;

app.use("/locations", locationRouter);
app.use("/auth/google", authRouter);
// app.use("/users", isAuthenticated, usersRouter);
app.use("/users", usersRouter);

server.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB");
    console.log("listening on port " + port);
  } catch (err) {
    console.error("Error connecting to Server", err);
  }
});

sockets.listenForTrips(io);
