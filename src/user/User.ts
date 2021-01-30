class User {
  id: number;
  spotifyId: string;
  authToken: string;
  refreshToken: string;
  expirationDate: Date;

  constructor(
    id: number,
    spotifyId: string,
    authToken: string,
    refreshToken: string,
    expirationDate: Date
  ) {
    this.id = id;
    this.spotifyId = spotifyId;
    this.authToken = authToken;
    this.refreshToken = refreshToken;
    this.expirationDate = expirationDate;
  }

  isTokenExpired(): boolean {
    const now = new Date().getTime();
    return now / 1000 > this.expirationDate.getTime() / 1000;
  }
}

export default User;
