import { gql } from 'apollo-server-azure-functions';

export default gql `
    extend type Mutation {
        Account_create(firstName: String, lastName:String, description:String): String
    }

    type Account {
        firstName: String
        lastName: String
        description: String
    }
`;