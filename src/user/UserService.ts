import { container, injectable } from "tsyringe";
import User from "./User";
import UserDao from "./UserDao";

@injectable()
class UserService {
  userDao = container.resolve(UserDao);

  async getAllUsers(): Promise<User[]> {
    const userJson = await this.userDao.getAllUsers();
    return userJson.map((user) => {
      return this.toEntity(user);
    });
  }

  async createUser(user: User): Promise<User> {
    const userJson = await this.userDao.createUser(user);
    user.id = userJson["id"];
    return user;
  }

  async getUserBySpotifyId(spotifyId: string): Promise<User | null> {
    const user = await this.userDao.getUserBySpotifyId(spotifyId);
    return user ? this.toEntity(user) : null;
  }

  async deleteUser(spotifyId: string): Promise<void> {
    const user = await this.getUserBySpotifyId(spotifyId);
    await this.userDao.deleteUser(user);
  }

  private toEntity(user: Record<string, unknown>): User {
    return new User(
      user["id"] as number,
      user["spotify_id"] as string,
      user["auth_token"] as string,
      user["refresh_token"] as string,
      user["expiration_date"] as Date
    );
  }
}

export default UserService;
