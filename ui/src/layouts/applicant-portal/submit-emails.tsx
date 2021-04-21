import { FC, useState } from 'react';
import { Row, Col, Button, Input } from 'antd';
import { gql, useMutation } from '@apollo/client';

const SUBMIT_REFERAL_EMAILS = gql`
  mutation($emails: [String]) {
    submitReferals(emails: $emails) {
      email
      existing
    }
  }
`;

const SubmitEmails: FC<any> = (props) => {
  const [email1, setEmail1] = useState('');
  const [name1, setName1] = useState('');
  const [existing1, setExisting1] = useState<undefined | boolean>(undefined);

  const [email2, setEmail2] = useState('');
  const [name2, setName2] = useState('');
  const [existing2, setExisting2] = useState<undefined | boolean>(undefined);

  const [gqlSubmitReferalEmails] = useMutation(SUBMIT_REFERAL_EMAILS);

  const submitReferalEmails = async () => {
    let emails = [email1, email2];
    //TODO: call mutation to submit referal emails
    await gqlSubmitReferalEmails({
      variables: {
        emails: emails,
      },
    }).then((data) => {
      setExisting1(data.data.submitReferals[0].existing);
      setExisting2(data.data.submitReferals[1].existing);
      alert('Finish');
    });
  };
  return (
    <>
      <Row>
        <Col>
          Doctor's name:{' '}
          <Input type="text" value={name1} onChange={(e: any) => setName1(e.target.value)} />
        </Col>
        <Col>
          Email:{' '}
          <Input
            style={{ backgroundColor: existing1 ? 'green' : 'red' }}
            type="text"
            value={email1}
            onChange={(e: any) => setEmail1(e.target.value)}
          />
          {existing1}
        </Col>
      </Row>

      <Row>
        <Col>
          Doctor's name:{' '}
          <Input type="text" value={name2} onChange={(e: any) => setName2(e.target.value)} />
        </Col>
        <Col>
          Email:{' '}
          <Input
            style={{ backgroundColor: existing2 ? 'green' : 'red' }}
            type="text"
            value={email2}
            onChange={(e: any) => setEmail2(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Button onClick={submitReferalEmails}>Submit</Button>
      </Row>
    </>
  );
};

export default SubmitEmails;
