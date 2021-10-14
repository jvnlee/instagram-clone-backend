import { gql } from "apollo-server-express";

export default gql`
  type Message {
    id: Int!
    payload: String!
    user: User!
    room: Room!
    isRead: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  type Room {
    id: Int!
    users: [User]
    messages(lastId: Int): [Message]
    unreadNum: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
