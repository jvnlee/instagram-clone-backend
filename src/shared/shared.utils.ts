import * as AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const uploadToAWS = async (
  file: any,
  userId: number,
  folderName: string
) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instagramclone-upload-jvnlee",
      Key: objName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};

export const deleteFromAWS = async (fileUrl: string) => {
  const filename = fileUrl.split("/uploads/")[1];
  await new AWS.S3()
    .deleteObject({
      Bucket: "instagramclone-upload-jvnlee/uploads",
      Key: filename,
    })
    .promise();
};
