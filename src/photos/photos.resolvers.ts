import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }, _, { client }) =>
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
    likes: ({ id }, _, { client }) =>
      client.like.count({ where: { photoId: id } }),
    commentNum: ({ id }, _, { client }) =>
      client.comment.count({ where: { photoId: id } }),
    comments: ({ id }, _, { client }) =>
      client.comment.findMany({
        where: { photoId: id },
        include: { user: true },
      }),
    isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
    isLiked: async ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) return false;
      const exists = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (exists) return true;
      return false;
    },
  },
  Hashtag: {
    photos: ({ id }, { lastId }, { client }) =>
      client.hashtag.findUnique({ where: { id } }).photos({
        take: 12,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        orderBy: { createdAt: "desc" },
      }),
    totalPhotos: ({ id }, _, { client }) =>
      client.photo.count({ where: { hashtags: { some: { id } } } }),
  },
};

export default resolvers;
