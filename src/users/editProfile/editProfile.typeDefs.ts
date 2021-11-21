import { gql } from "apollo-server-express";

export default gql`
  scalar Upload
  type EditProfileResponse {
    status: Boolean!
    error: String
    avatarUrl: String
  }
  type Mutation {
    editProfile(
      firstName: String
      lastName: String
      username: String
      email: String
      bio: String
      avatar: Upload
    ): EditProfileResponse!
  }
`;
