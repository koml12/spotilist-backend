import { Serializable } from "../common";
import UserObject from "./UserObject";

class User implements Serializable<UserObject> {
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

  serialize(): UserObject {
    return {
      id: this.id,
      spotify_id: this.spotifyId,
      auth_token: this.authToken,
      refresh_token: this.refreshToken,
      expiration_date: this.expirationDate,
    };
  }

  deserialize(obj: UserObject): this {
    this.id = obj.id;
    this.spotifyId = obj.spotify_id;
    this.authToken = obj.auth_token;
    this.refreshToken = obj.refresh_token;
    this.expirationDate = obj.expiration_date;
    return this;
  }

  equals(obj: UserObject): boolean {
    return (
      this.id === obj.id &&
      this.spotifyId === obj.spotify_id &&
      this.authToken === obj.auth_token &&
      this.refreshToken === obj.refresh_token &&
      this.expirationDate === obj.expiration_date
    );
  }
}

export default User;
