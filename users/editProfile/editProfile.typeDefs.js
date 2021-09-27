import { gql } from "apollo-server-core";

export default gql`
  type EditProfileResult {
    status: Boolean!
    error: String
  }
  type Mutation {
    editProfile(
      firstName: String
      lastName: String
      username: String
      email: String
      password: String
      token: String!
    ): EditProfileResult!
  }
`;
