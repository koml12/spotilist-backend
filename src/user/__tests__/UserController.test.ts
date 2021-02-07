import { container } from "tsyringe";
import { Request } from "express";
import MockRequest from "../../../test/MockRequest";
import User from "../User";
import UserController from "../UserController";
import UserService from "../UserService";

describe("UserController", () => {
  class MockUserService extends UserService {}

  let userController = container.resolve(UserController);

  beforeEach(() => {
    container.register<UserService>(UserService, MockUserService);
    userController = container.resolve(UserController);
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [new User(1, "spotify", "auth", "refresh", new Date())];
      MockUserService.prototype.getAllUsers = () => Promise.resolve(users);
      const response = await userController.getAllUsers();

      expect(response.length).toEqual(users.length);
      expect(users[0].equals(response[0])).toBeTruthy();
    });
  });

  describe("getUserBySpotifyId", () => {
    it("should return user if user exists with ID", async () => {
      const user = new User(1, "spotify", "auth", "refresh", new Date());
      MockUserService.prototype.getUserBySpotifyId = () =>
        Promise.resolve(user);
      const request = new MockRequest().addParameter("spotifyId", "spotify");
      const response = await userController.getUserBySpotifyId(
        (request as unknown) as Request
      );

      expect(response).toEqual(user.serialize());
    });

    it("should return undefined if user does not exist", async () => {
      MockUserService.prototype.getUserBySpotifyId = () =>
        Promise.resolve(undefined);
      const request = new MockRequest().addParameter("spotifyId", "spotify");
      const response = await userController.getUserBySpotifyId(
        (request as unknown) as Request
      );

      expect(response).toBeFalsy();
    });
  });

  describe("delete user", () => {
    it("should invoke service class delete directly", async () => {
      const deleteMock = jest.fn(async () => Promise.resolve());
      MockUserService.prototype.deleteUser = deleteMock;
      const request = new MockRequest().addParameter("spotifyId", "spotify");
      await userController.deleteUser((request as unknown) as Request);
      expect(deleteMock).toHaveBeenCalledTimes(1);
    });
  });
});
