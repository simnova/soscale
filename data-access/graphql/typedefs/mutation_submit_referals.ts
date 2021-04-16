import { gql } from 'apollo-server-azure-functions';

export default gql`
  extend type Mutation {
    submitReferals(emails: [String]): String
  }
`;
