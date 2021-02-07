import * as dotenv from "dotenv";
dotenv.config();

// Enables Dependency Injection in the project
import "reflect-metadata";

import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

import { User, UserService, getUserRoutes } from "./user";
import { container } from "tsyringe";

const userService = container.resolve(UserService);

const app = express();
const port = process.env.PORT || "8000";

const api = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

app.get("/", (_req, res) => {
  res.redirect("/hello/");
});

app.get("/hello/:name", (req, res) => {
  const { name = "World" } = req.params;
  return res.json({
    hello: name,
  });
});

app.get("/auth/url", (req, res) => {
  const scopes = ["user-read-private"];
  const url = api.createAuthorizeURL(scopes, "" + req.query.callback, true);
  res.send(url);
});

app.get("/callback", async (req, res) => {
  const code = "" + req.query.code;
  const callback = "" + req.query.state;

  try {
    const data = await api.authorizationCodeGrant(code);
    const accessToken = data.body["access_token"];
    const refreshToken = data.body["refresh_token"];
    const expiresIn = data.body["expires_in"];
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + expiresIn * 1000);

    api.setAccessToken(accessToken);
    api.setRefreshToken(refreshToken);

    const me = await api.getMe();

    await userService.createUser(
      new User(undefined, me.body.id, accessToken, refreshToken, expirationDate)
    );

    res.redirect(callback);
  } catch (error) {
    console.log("Error creating user: ", error);
    res.redirect(callback);
  }
});

app.use("/users", getUserRoutes());

app.listen(port, () => console.log(`Server is listening on ${port}`));
