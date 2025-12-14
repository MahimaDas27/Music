export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(error);
  }

  if (!code) {
    return res.status(400).send("No authorization code");
  }

  // TEMP: just prove redirect works
  res.send("Spotify auth successful. Code received.");
}
