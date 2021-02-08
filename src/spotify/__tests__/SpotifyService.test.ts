import { container } from "tsyringe";
import SpotifyService from "../SpotifyService";

describe("SpotifyService", () => {
  describe("getSpotifyApi", () => {
    it("should return Spotify API object", () => {
      const spotifyService = container.resolve(SpotifyService);
      expect(spotifyService.getSpotifyApi()).toBeTruthy();
    });
  });
});
