import { FC, useState } from 'react';
import { Row, Col, Button, Input } from 'antd';

const SubmitEmails: FC<any> = (props) => {
  const [email1, setEmail1] = useState('');
  const [name1, setName1] = useState('');

  const [email2, setEmail2] = useState('');
  const [name2, setName2] = useState('');

  const submitReferalEmails = () => {
    //TODO: call mutation to submit referal emails
    let emails = [email1, email2];

    return;
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
          <Input type="text" value={email1} onChange={(e: any) => setEmail1(e.target.value)} />
        </Col>
      </Row>

      <Row>
        <Col>
          Doctor's name:{' '}
          <Input type="text" value={name2} onChange={(e: any) => setName2(e.target.value)} />
        </Col>
        <Col>
          Email:{' '}
          <Input type="text" value={email2} onChange={(e: any) => setEmail2(e.target.value)} />
        </Col>
      </Row>
      <Row>
        <Button onClick={submitReferalEmails}>Submit</Button>
      </Row>
    </>
  );
};

export default SubmitEmails;
