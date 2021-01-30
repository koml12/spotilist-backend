# Roadmap / Feature List

## What info do we need to store?

- If we're only going through the Spotify `/me/` endpoints, then we can control the current user through the auth token that is passed with each API request.
- But the user needs to know what auth token to send and when to refresh their auth
- A better solution is to have a simple DB table: `User`, with fields:
  - ID (implicit)
  - Username
  - Auth token
  - Refresh token
  - Expiration date
- We can manage requesting the user's information. When we authenticate the user initially, we can send the user ID (Spotify username) back to the API consumer. Then it is up to them to include the user ID for any subsequent requests
- We will handle refreshing access tokens for each user that we have. We will only refresh access tokens if a request comes in after the expiration date column in the table.
- Security concerns:
  - Can store username in plain text
  - Definitely need to hash the tokens

## Strategy for user login/creation

- We supply an endpoint `/auth/url` that will send back the URL to navigate to for authentication. This URL will specify the `redirect_uri` to an endpoint `/auth/user`
- The `/auth/callback` endpoint will have an access code attached as a query parameter. It will create a new user by first sending a request for an auth token, then requesting the current user's info to get the username. Then it will redirect to whatever the user passed into the first `/auth/url` request

- The total steps are:

1. Front end sends request to `/auth/url` with the callback url for after auth is done. Back end will construct a suitable Spotify auth URL based on the values provided, using the callback url as "state"
2. Front end redirects the user to the URL it just received.
3. User signs in to Spotify. Spotify redirects to the back end's `/auth/callback` route, passing along the callback URL provided in Step 1. This triggers a back end process to create a new `User`, requesting auth tokens from Spotify and expiration date for the tokens (and possibly the Spotify user ID). Finally, the back end redirects to the callback URL supplied in step 1.
