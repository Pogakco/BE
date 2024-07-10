import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { extname } from "path";
import { s3Client } from "../config/aws-config.js";
import { AWS_S3_DIRECTORY } from "../constants.js";
import { trim, trimStart } from "../utils/trim.js";

const uploadFileToS3 = async ({ file, directory }) => {
  try {
    // Key값이 '/foo//file.jpg'와 같이 되는 것을 방지하고, directory가 없거나 공백일 경우 디폴트 경로로 처리
    directory = !!directory ? trim(directory, "/") : AWS_S3_DIRECTORY.DEFAULT;

    const extensionName = extname(file.originalname); // 확장자명('.' 포함)
    const fileName = randomUUID() + extensionName;

    const filePathname = `/${directory}/${fileName}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: trimStart(filePathname, "/"), // S3에 "/" 디렉터리가 생기는걸 방지
      Body: file.buffer,
    });

    const response = await s3Client.send(putObjectCommand);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com${filePathname}`;

    return { fileUrl, filePathname, response };
  } catch (error) {
    throw error;
  } finally {
    s3Client.destroy();
  }
};

export default uploadFileToS3;
