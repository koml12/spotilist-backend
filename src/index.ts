require("dotenv").config();

// Enables Dependency Injection in the project
import "reflect-metadata";

import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

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
    const access_token = data.body["access_token"];
    const refresh_token = data.body["refresh_token"];
    const expires_in = data.body["expires_in"];

    api.setAccessToken(access_token);
    api.setRefreshToken(refresh_token);

    const me = await api.getMe();
    console.log(me);

    res.redirect(callback);
  } catch (error) {
    console.log("error: ", error);
    res.redirect(callback);
  }
});

app.listen(port, () => console.log(`Server is listening on ${port}`));
