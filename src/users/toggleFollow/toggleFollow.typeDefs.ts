import { gql } from "apollo-server-express";

export default gql`
  type ToggleFollowResult {
    status: Boolean!
    error: String
    isFollowing: Boolean
  }
  type Mutation {
    toggleFollow(username: String!): ToggleFollowResult!
  }
`;
