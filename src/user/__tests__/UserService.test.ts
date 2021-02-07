import { container } from "tsyringe";
import User from "../User";
import UserDao from "../UserDao";
import UserService from "../UserService";

/**
 * @group unit
 */
describe("UserService", () => {
  beforeAll(() => {
    container.register<UserDao>(UserDao, MockUserDao);
  });

  afterAll(() => {
    container.clearInstances();
  });

  class MockUserDao extends UserDao {}

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const user = new User(1, "spotify", "auth", "refresh", new Date());
      MockUserDao.prototype.getAllUsers = () => {
        return Promise.resolve([
          {
            id: user.id,
            spotify_id: user.spotifyId,
            auth_token: user.authToken,
            refresh_token: user.refreshToken,
            expiration_date: user.expirationDate,
          },
        ]);
      };

      const userService = container.resolve(UserService);

      const allUsers = await userService.getAllUsers();
      expect(allUsers).toContainEqual(user);
    });
  });

  describe("createUser", () => {
    it("should set the ID of the user after creation", async () => {
      let user = new User(undefined, "spotify", "auth", "refresh", new Date());

      MockUserDao.prototype.createUser = async () =>
        Promise.resolve({
          id: 1,
          spotify_id: "spotifyID",
          auth_token: "auth",
          refresh_token: "refresh",
          expiration_date: new Date(),
        });

      const userService = container.resolve(UserService);

      user = await userService.createUser(user);

      expect(user.id).toEqual(1);
    });
  });

  describe("getUserBySpotifyId", () => {
    const user = new User(1, "spotify", "auth", "refresh", new Date());
    beforeAll(() => {
      MockUserDao.prototype.getUserBySpotifyId = async (spotifyID) =>
        Promise.resolve(
          spotifyID === user.spotifyId ? user.serialize() : undefined
        );
    });

    it("should get a user when user with ID exists", async () => {
      const userService = container.resolve(UserService);

      const foundUser = await userService.getUserBySpotifyId(user.spotifyId);
      expect(foundUser).toEqual(user);
    });

    it("should return null when no user has the given ID", async () => {
      const userService = container.resolve(UserService);

      const foundUser = await userService.getUserBySpotifyId("invalid");
      expect(foundUser).toBeNull();
    });
  });

  describe("deleteUser", () => {
    it("should invoke DAO deletion", async () => {
      const deleteUserMock = jest.fn(async () => Promise.resolve());
      MockUserDao.prototype.deleteUser = deleteUserMock;
      const userService = container.resolve(UserService);

      await userService.deleteUser("");
      expect(deleteUserMock).toHaveBeenCalledTimes(1);
    });
  });
});
