import { gql } from "apollo-server-express";

export default gql`
  type SeeFollowersResult {
    status: Boolean!
    error: String
    followers: [User]
    totalPages: Int
  }

  type Query {
    seeFollowers(username: String!, page: Int!): SeeFollowersResult!
  }
`;
