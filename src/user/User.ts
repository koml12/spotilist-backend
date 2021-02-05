import Entity from "../common/Entity";

class User extends Entity {
  id?: number;
  spotifyId: string;
  authToken: string;
  refreshToken: string;
  expirationDate: Date;

  constructor(
    id: number | undefined,
    spotifyId: string,
    authToken: string,
    refreshToken: string,
    expirationDate: Date
  ) {
    super();
    this.id = id;
    this.spotifyId = spotifyId;
    this.authToken = authToken;
    this.refreshToken = refreshToken;
    this.expirationDate = expirationDate;
  }

  isTokenExpired(): boolean {
    const now = new Date().getTime();
    return now / 1000 > this.expirationDate.getTime() / 1000;
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      spotify_id: this.spotifyId,
      auth_token: this.authToken,
      refresh_token: this.refreshToken,
      expiration_date: this.expirationDate,
    };
  }
}

export default User;
