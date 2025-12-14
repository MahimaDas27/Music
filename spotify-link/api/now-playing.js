import axios from "axios";

const getAccessToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
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

  return response.data.access_token;
};

export default async function handler(req, res) {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 204 || !response.data) {
      return res.status(200).json({ isPlaying: false });
    }

    const item = response.data.item;

    res.status(200).json({
      isPlaying: response.data.is_playing,
      title: item.name,
      artist: item.artists.map(a => a.name).join(", "),
      albumArt: item.album.images[0].url,
      songUrl: item.external_urls.spotify,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
