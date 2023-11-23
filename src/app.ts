import dotenv from "dotenv";
import express, { Application, Router } from "express";
import bodyParser from "body-parser";
import CreatceRoutes from "./routes";
import cors from "cors";

dotenv.config();

class App {
  public app: Application;
  public port: number;
  appRoutes = new CreatceRoutes();

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRouters(this.appRoutes.routers);
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

  // Initialize all the routes of the application
  private initializeRouters(router: Router[]): void {
    router.forEach((routes: Router) => {
      this.app.use("/api", routes);
    });
  }

  // Server will listen to this port
  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
export default App;
