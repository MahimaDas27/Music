export default function handler(req, res) {
  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state"
  ].join(" ");

  const redirectUri = "https://spotifylink.vercel.app/api/callback";

  const url =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: redirectUri,
    });

  res.redirect(url);
}
