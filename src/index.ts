import App from "./app";

const app = new App(
  process.env.PORT ? parseInt(process.env.PORT as string, 10) : 5000
);

app.listen();
// app.connectToTheDatabase();
