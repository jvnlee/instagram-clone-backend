export const formatHashtags = (caption: string): any[] => {
  // Using RegEx to extract words that start with #.
  const hashtags = caption.match(/#[\w]+/g);
  // Mapping is for formatting the extracted hashtags to make them fit into the connectOrCreate syntax.
  return hashtags?.map((hashtag) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};
