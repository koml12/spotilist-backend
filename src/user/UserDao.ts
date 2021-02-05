/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "tsyringe";
import Dao from "../db/Dao";
import User from "./User";

@injectable()
class UserDao extends Dao {
  getTableName(): string {
    return "user";
  }

  async getAllUsers(): Promise<any[]> {
    const users = await this.getDbClient().select();
    console.log(users);
    return users;
  }

  async createUser(user: User): Promise<any> {
    const userJson = await this.getDbClient()
      .insert({
        spotify_id: user.spotifyId,
        auth_token: user.authToken,
        refresh_token: user.refreshToken,
        expiration_date: user.expirationDate,
      })
      .returning("*");
    return userJson;
  }

  async getUserBySpotifyId(
    spotifyId: string
  ): Promise<Record<string, unknown> | undefined> {
    return (await this.findByCriteria({ spotify_id: spotifyId }))[0];
  }

  async deleteUser(user: User | null): Promise<void> {
    if (user != null) {
      await this.getDbClient().delete().where({ spotify_id: user.spotifyId });
    }
  }
}

export default UserDao;
