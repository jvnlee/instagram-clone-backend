import { gql } from "apollo-server-express";

export default gql`
  type Comment {
    id: String!
    user: User!
    photo: Photo!
    payload: String!
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
