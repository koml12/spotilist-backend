import { container } from "tsyringe";
import UserDao from "../UserDao";
import User from "../User";

/**
 * @group integration
 */
describe("UserDao", () => {
  it("should insert and update data correctly", async () => {
    const userDao = container.resolve(UserDao);
    const user = new User(
      undefined,
      "spotifyID",
      "auth",
      "refresh",
      new Date()
    );
    const userJson = await userDao.createUser(user);
    user.id = userJson["id"];

    let users = await userDao.getAllUsers();
    expect(users.map((u) => u["spotify_id"])).toContain("spotifyID");

    let foundUser = await userDao.getUserBySpotifyId("spotifyID");
    expect(foundUser?.spotify_id).toEqual(user.spotifyId);

    foundUser = await userDao.getUserBySpotifyId("invalid");
    expect(foundUser).toBeUndefined();

    await userDao.deleteUser(undefined);
    users = await userDao.getAllUsers();
    expect(users.map((u) => u["spotify_id"])).toContain("spotifyID");

    await userDao.deleteUser(user);
    users = await userDao.getAllUsers();
    expect(users.map((u) => u["spotify_id"])).not.toContain("spotifyID");
  });
});
