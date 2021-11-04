import { gql } from "apollo-server-express";

export default gql`
  type MutationResponse {
    status: Boolean!
    error: String
    id: Int
  }
`;
