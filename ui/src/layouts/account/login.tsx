import { FC } from 'react';
import {Row,Col,Button } from 'antd';
import { useMsal } from '../../components/msal-react-lite';

const Login: FC<any> = () => {
  const {login} = useMsal();

  const loginAction = async (loginType:string) => {
    login(loginType)
  }


  return (
    <>
      <Row style={{"backgroundColor":"white"}}>
        <Col span={12}>
          <h3>Passwordless Login</h3>
          <Button type="primary" onClick={() =>loginAction('popupconfig')}>Log In</Button>
        </Col>
        <Col span={12}>
          <h3>Assigned Login</h3>
          <Button type="primary" onClick={() =>loginAction('redirectconfig')}>Log In</Button>
        </Col>
      </Row>
    </>
  )
}

export default Login;