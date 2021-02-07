import { Request } from "express";
import { container, injectable } from "tsyringe";
import UserObject from "./UserObject";
import UserService from "./UserService";

@injectable()
class UserController {
  userService = container.resolve(UserService);

  async getAllUsers(): Promise<UserObject[]> {
    const users = await this.userService.getAllUsers();
    return users.map((user) => user.serialize());
  }

  async getUserBySpotifyId(req: Request): Promise<UserObject | undefined> {
    const { spotifyId } = req.params;
    const user = await this.userService.getUserBySpotifyId(spotifyId);
    return user?.serialize();
  }

  async deleteUser(req: Request): Promise<void> {
    const { spotifyId } = req.params;
    await this.userService.deleteUser(spotifyId);
  }
}

export default UserController;
