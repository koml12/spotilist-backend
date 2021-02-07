import { container, injectable } from "tsyringe";
import User from "./User";
import UserDao from "./UserDao";

@injectable()
class UserService {
  userDao = container.resolve(UserDao);

  async getAllUsers(): Promise<User[]> {
    const userJson = await this.userDao.getAllUsers();
    return userJson.map((user) => {
      return User.prototype.deserialize(user);
    });
  }

  async createUser(user: User): Promise<User> {
    const userJson = await this.userDao.createUser(user);
    user.id = userJson.id;
    return user;
  }

  async getUserBySpotifyId(spotifyId: string): Promise<User | undefined> {
    const user = await this.userDao.getUserBySpotifyId(spotifyId);
    return user ? User.prototype.deserialize(user) : undefined;
  }

  async deleteUser(spotifyId: string): Promise<void> {
    const user = await this.getUserBySpotifyId(spotifyId);
    await this.userDao.deleteUser(user);
  }
}

export default UserService;
