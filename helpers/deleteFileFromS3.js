import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws-config.js";
import { trimStartSlash } from "../utils/trimSlash.js";

const deleteFileFromS3 = async ({ pathname }) => {
  try {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: trimStartSlash(pathname), // Key는 '/'로 시작하지 않아서, 혹여나 삭제되지 않는 경우를 방지
    });
    const response = await s3Client.send(deleteObjectCommand);

    return response;
  } catch (error) {
    throw error;
  } finally {
    s3Client.destroy();
  }
};

export default deleteFileFromS3;
