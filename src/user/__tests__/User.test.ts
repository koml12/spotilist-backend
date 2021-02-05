import User from "../User";

/**
 * @group unit
 */
describe("User", () => {
  describe("constructor", () => {
    it("should create a new user", () => {
      const expirationDate = new Date();
      const user = new User(1, "spotifyId", "auth", "refresh", expirationDate);
      expect(user.id).toEqual(1);
      expect(user.spotifyId).toEqual("spotifyId");
      expect(user.authToken).toEqual("auth");
      expect(user.refreshToken).toEqual("refresh");
      expect(user.expirationDate).toEqual(expirationDate);
    });
  });

  describe("isTokenExpired", () => {
    it("should return true when token is expired", () => {
      const millisInADay = 24 * 60 * 60 * 1000;
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() - millisInADay);
      const user = new User(1, "spotifyId", "auth", "refresh", expirationDate);
      expect(user.isTokenExpired()).toBeTruthy();
    });

    it("should return false when token is not expired", () => {
      const millisInADay = 24 * 60 * 60 * 1000;
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + millisInADay);
      const user = new User(1, "spotifyId", "auth", "refresh", expirationDate);
      expect(user.isTokenExpired()).toBeFalsy();
    });
  });
});
