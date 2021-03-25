import { gql } from 'apollo-server-azure-functions';

export default gql `
    extend type Query {
        hello: String
    }
  `;