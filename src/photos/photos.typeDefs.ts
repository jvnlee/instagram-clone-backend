import { gql } from "apollo-server-core";

export default gql`
    type Photo {
        id: String!
        user: User
        file: String!
        caption: String
        hashtag: [Hashtag]
        createdAt: String!
        updatedAt: String!
    }
`;