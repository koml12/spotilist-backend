interface UserObject {
  id?: number;
  spotify_id: string;
  auth_token: string;
  refresh_token: string;
  expiration_date: Date;
}

export default UserObject;
