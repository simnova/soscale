import { gql } from 'apollo-server-azure-functions';

export default gql`

  type submitReferalsResults {
    email: String
    existing: Boolean
  }
  extend type Mutation {
    submitReferals(emails: [String]): [submitReferalsResults]
  }
`;
