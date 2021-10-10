import { gql } from "apollo-server-core";

export default gql`
  type CreateCommentResult {
    status: Boolean!
    error: String
  }
  type Mutation {
    createComment(photoId: Int!, payload: String!): CreateCommentResult!
  }
`;
