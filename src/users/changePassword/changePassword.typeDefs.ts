import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    changePassword(password: String!, newPassword: String!): MutationResponse!
  }
`;
