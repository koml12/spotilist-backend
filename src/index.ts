import * as dotenv from "dotenv";
dotenv.config();

// Enables Dependency Injection in the project
import "reflect-metadata";

import express from "express";

import { getUserRoutes } from "./user";
import { getAuthRoutes } from "./auth";

const app = express();
const port = process.env.PORT || "8000";

app.get("/", (_req, res) => {
  res.redirect("/hello/");
});

app.get("/hello/:name", (req, res) => {
  const { name = "World" } = req.params;
  return res.json({
    hello: name,
  });
});

app.use("", getAuthRoutes());
app.use("/users", getUserRoutes());

app.listen(port, () => console.log(`Server is listening on ${port}`));
