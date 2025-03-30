import {v2 as cloudinary} from 'cloudinary';
import { UploadedFile } from 'express-fileupload';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export const uploadFile = (file: UploadedFile, resourceType: 'image' | 'raw'): Promise<string> => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: resourceType }, (err, result) => {
        if (err || !result) reject(err);
        else resolve(result.secure_url);
      }).end(file.data);
    });
  };
  