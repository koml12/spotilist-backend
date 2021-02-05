require("dotenv").config();

// Enables Dependency Injection in the project
import "reflect-metadata";

import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

import { User, UserService } from "./user";
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
  console.log(req.query.code);
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

    const user = await userService.createUser(
      new User(undefined, me.body.id, accessToken, refreshToken, expirationDate)
    );
    console.log(user);

    res.redirect(callback);
  } catch (error) {
    console.log("error: ", error);
    res.redirect(callback);
  }
});

app.get("/users", async (_req, res) => {
  const users = await userService.getAllUsers();
  res.json(JSON.parse(JSON.stringify(users)));
});

app.delete("/users/:spotifyId", async (req, res) => {
  const spotifyId = req.params.spotifyId;
  await userService.deleteUser(spotifyId);
  return res.sendStatus(204);
});

app.listen(port, () => console.log(`Server is listening on ${port}`));
