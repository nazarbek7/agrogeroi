import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (error, result) => {
        if (error || !result) reject(error ?? new Error("Upload failed"));
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
}

export async function deleteImage(url: string): Promise<void> {
  if (!url?.includes("cloudinary.com")) return;
  try {
    // URL: https://res.cloudinary.com/cloud/image/upload/v123/folder/name.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    if (match) await cloudinary.uploader.destroy(match[1]);
  } catch {}
}

export default cloudinary;
