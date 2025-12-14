import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;
  const redirectUri = "https://spotifylink.vercel.app/api/callback";

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { refresh_token } = response.data;

    res.status(200).send(`
      <h1>✅ Spotify Connected</h1>
      <p><strong>Copy this refresh token:</strong></p>
      <pre>${refresh_token}</pre>
      <p>Add it to Vercel as <code>SPOTIFY_REFRESH_TOKEN</code></p>
    `);
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
}
