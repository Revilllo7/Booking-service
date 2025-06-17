import express from "express";
import routes from "./routes";

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});