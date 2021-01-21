import { gql } from 'apollo-server-azure-functions';
import getServerTime from './get-server-time';
import hello from './hello';
import account from './account';

const typeDefs = gql`
    type Mutation {
        _empty:String
    }
    type Query {
        _empty:String
    }
`;

export default [
    typeDefs,
    getServerTime,
    hello,
    account
]