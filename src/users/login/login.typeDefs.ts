import { gql } from "apollo-server-core";

export default gql`
  type LoginResult {
    status: Boolean!
    token: String
    error: String
  }
  type Mutation {
    login(username: String!, password: String!): LoginResult!
  }
`;
