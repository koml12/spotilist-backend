import { Request } from "express";
import { User, UserService } from "../user";
import { container, injectable } from "tsyringe";
import { SpotifyService } from "../spotify";

@injectable()
class AuthController {
  userService = container.resolve(UserService);
  api = container.resolve(SpotifyService).getSpotifyApi();

  redirectPath = process.env.SPOTIFY_REDIRECT_URI_SUFFIX || "/callback";

  getAuthUrl(req: Request): string {
    const scopes = ["user-read-private"];
    return this.api.createAuthorizeURL(scopes, "" + req.query.callback, true);
  }

  async createUserFromCallback(req: Request): Promise<void> {
    const code = "" + req.query.code;
    try {
      const data = await this.api.authorizationCodeGrant(code);
      const accessToken = data.body["access_token"];
      const refreshToken = data.body["refresh_token"];
      const expiresIn = data.body["expires_in"];
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + expiresIn * 1000);

      this.api.setAccessToken(accessToken);
      this.api.setRefreshToken(refreshToken);

      const me = await this.api.getMe();

      await this.userService.createUser(
        new User(
          undefined,
          me.body.id,
          accessToken,
          refreshToken,
          expirationDate
        )
      );
    } catch (error) {
      console.log("Error creating user: ", error);
    }
  }
}

export default AuthController;
