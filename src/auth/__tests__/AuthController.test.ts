import { UserService } from "../../user";
import { container } from "tsyringe";
import AuthController from "../AuthController";
import MockRequest from "../../../test/MockRequest";
import { Request } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyService } from "../../spotify";

describe("AuthController", () => {
  let authController = container.resolve(AuthController);
  class MockUserService extends UserService {}
  class MockSpotifyApi extends SpotifyWebApi {}
  class MockSpotifyService extends SpotifyService {}

  beforeEach(() => {
    MockSpotifyService.prototype.getSpotifyApi = () => new MockSpotifyApi();
    container.register<UserService>(UserService, MockUserService);
    container.register<SpotifyService>(SpotifyService, MockSpotifyService);
    authController = container.resolve(AuthController);
  });

  describe("getAuthUrl", () => {
    it("should produce a URL attaching the given callback URL", () => {
      const createUrlMock = jest.fn(
        (scopes, state, showDialog) => `${scopes}${state}${showDialog}`
      );
      MockSpotifyApi.prototype.createAuthorizeURL = createUrlMock;
      const callback = "http://localhost:8000/callback";
      const request = new MockRequest().addQuery("callback", callback);
      authController.getAuthUrl((request as unknown) as Request);
      expect(createUrlMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("createUserFromCallback", () => {
    it("should fetch auth tokens and create a new user", async () => {
      const createUserMock = jest.fn(async (user) => Promise.resolve(user));
      const authorizeUserMock = jest.fn(async () =>
        Promise.resolve({
          body: {
            access_token: "access_token",
            refresh_token: "refresh_token",
            expires_in: 60,
            token_type: "",
            scope: "",
          },
          headers: {},
          statusCode: 200,
        })
      );
      const getMeMock = jest.fn(async () =>
        Promise.resolve({
          body: {
            id: "spotifyID",
          } as SpotifyApi.CurrentUsersProfileResponse,
          headers: {},
          statusCode: 200,
        })
      );
      MockSpotifyApi.prototype.authorizationCodeGrant = authorizeUserMock;
      MockSpotifyApi.prototype.getMe = getMeMock;
      MockUserService.prototype.createUser = createUserMock;
      const request = new MockRequest().addQuery("code", "code");
      await authController.createUserFromCallback(
        (request as unknown) as Request
      );
      expect(createUserMock).toHaveBeenCalledTimes(1);
    });

    it("should not create a user if there is an error", async () => {
      const createUserMock = jest.fn(async (user) => Promise.resolve(user));
      const authorizeUserMock = jest.fn(async () =>
        Promise.reject("some random reason")
      );
      MockSpotifyApi.prototype.authorizationCodeGrant = authorizeUserMock;
      const request = new MockRequest().addQuery("code", "code");
      await authController.createUserFromCallback(
        (request as unknown) as Request
      );
      expect(createUserMock).toHaveBeenCalledTimes(0);
    });
  });
});
