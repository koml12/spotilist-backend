import SpotifyWebApi from "spotify-web-api-node";
import { injectable } from "tsyringe";

@injectable()
class SpotifyService {
  redirectBase =
    process.env.SPOTIFY_REDIRECT_URI_BASE || "http://localhost:8000";
  redirectPath = process.env.SPOTIFY_REDIRECT_URI_SUFFIX || "/callback";

  private api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `${this.redirectBase}${this.redirectPath}`,
  });

  getSpotifyApi(): SpotifyWebApi {
    return this.api;
  }
}

export default SpotifyService;
