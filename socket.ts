import { Server, Socket as SocketType } from "socket.io";
import type { Server as HttpServerType } from "http";

export class SocketIO extends Server {
  constructor(server: HttpServerType) {
    super(server);
  }

  startConnection() {
    console.log("Starting socket connection!");
    this.on("connection", (socket: SocketType) => {
      socket.on("message", (data) => {
        console.log(data);
      });
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
}
