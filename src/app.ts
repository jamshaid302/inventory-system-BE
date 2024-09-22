import dotenv from "dotenv";
import express, { Application, Router } from "express";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import { requestLogger } from "./middlewares";
import CreatceRoutes from "./routes";
import CronHandler from "./cron";
import cors from "cors";

dotenv.config();

class App {
  public app: Application;
  public port: number;
  public server: http.Server;
  public io: Server;
  appRoutes = new CreatceRoutes();
  cron = new CronHandler();

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.initializeMiddlewares();
    this.initializeRouters(this.appRoutes.routers);
    this.initializeSockets();
    this.initializeCronJobs();
    this.initializeRequestLogger();
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    const corsOptions = {
      origin: ["http://localhost:3000"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // Enable credentials (cookies, Authorization headers, etc.)
    };

    this.app.use(cors(corsOptions));
  }

  private initializeRequestLogger() {
    this.app.use(requestLogger);
  }

  // Initialize all the routes of the application
  private initializeRouters(router: Router[]): void {
    router.forEach((routes: Router) => {
      this.app.use("/api", routes);
    });
  }

  // Initialize cron jobs
  private initializeCronJobs() {
    this.cron.mainCronHandler(this.io);
  }

  // Initialize the socker.io server
  private initializeSockets(): void {
    this.io.on("connection", (socket) => {
      console.log("A user connected");
      // socket.emit('message', 'Welcome to the server!');
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }

  // Server will listen to this port
  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
export default App;
