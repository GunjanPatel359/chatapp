import { createServer } from "node:http";
import next from "next";
import { setupSocket, getIo } from "./socket.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(handler);

  // ✅ Ensure socket is fully initialized before using `getIo()`
  await setupSocket(httpServer);

  // const io = getIo(); // ✅ Should not be null now
  // console.log("🎉 [Socket.IO] Retrieved instance:", io ? "✅ Exists" : "❌ Null");

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`🚀 Ready on http://${hostname}:${port}`);
    });
});
