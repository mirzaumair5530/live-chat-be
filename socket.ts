import { Server } from "socket.io";
import type { Server as HttpServerType } from "http";

export const setupSocket = (server: HttpServerType) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
