require('dotenv').config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

imagekit.listFiles({ limit: 1 })
  .then(res => console.log("✅ Credentials are working:", res))
  .catch(err => console.error("❌ Invalid credentials:", err.message));
