const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(fileBuffer, fileName) {
  try {
    const result = await imagekit.upload({
      file: fileBuffer, // base64 string
      fileName: fileName,
    });
    return result;
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw new Error("Image upload failed");
  }
}

async function deleteFile(fileId) {
  try {
    if (!fileId) return null;
    const result = await imagekit.deleteFile(fileId);
    return result;
  } catch (error) {
    console.error('ImageKit Delete Error:', error);
    // don't throw to avoid blocking DB deletes; return null to indicate failure
    return null;
  }
}

module.exports = { uploadFile, deleteFile };
