import { gql } from "apollo-server-express";

export default gql`
  type UnfollowUserResult {
    status: Boolean!
    error: String
  }
  type Mutation {
    unfollowUser(username: String!): UnfollowUserResult
  }
`;
