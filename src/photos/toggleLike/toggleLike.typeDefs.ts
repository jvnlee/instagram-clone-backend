import { gql } from "apollo-server-express";

export default gql`
  type LikePhotoResult {
    status: Boolean!
    error: String
  }
  type Mutation {
    toggleLike(id: Int!): LikePhotoResult!
  }
`;
