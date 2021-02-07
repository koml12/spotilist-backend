import { injectable } from "tsyringe";
import Dao from "../db/Dao";
import User from "./User";
import UserObject from "./UserObject";

@injectable()
class UserDao extends Dao<UserObject> {
  getTableName(): string {
    return "user";
  }

  async getAllUsers(): Promise<UserObject[]> {
    const users = await this.getDbClient().select();
    return users.map((user: unknown) => (user as unknown) as UserObject);
  }

  async createUser(user: User): Promise<UserObject> {
    const userJson = await this.getDbClient()
      .insert({
        spotify_id: user.spotifyId,
        auth_token: user.authToken,
        refresh_token: user.refreshToken,
        expiration_date: user.expirationDate,
      })
      .returning("*");
    return (userJson as unknown) as UserObject;
  }

  async getUserBySpotifyId(spotifyId: string): Promise<UserObject | undefined> {
    const users = await this.findByCriteria({ spotify_id: spotifyId });
    return typeof users[0] !== "undefined"
      ? (users[0] as UserObject)
      : undefined;
  }

  async deleteUser(user: User | undefined): Promise<void> {
    if (user) {
      await this.getDbClient().delete().where({ spotify_id: user.spotifyId });
    }
  }
}

export default UserDao;
