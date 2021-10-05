import { gql } from "apollo-server-express";

export default gql`
  type SearchUsersResult {
    searchResult: [User]
    error: String
  }
  type Query {
    searchUsers(keyword: String!, lastId: Int): SearchUsersResult!
  }
`;
