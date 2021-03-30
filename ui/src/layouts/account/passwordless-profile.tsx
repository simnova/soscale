import { FC } from 'react';
import { useMsal } from '../../components/msal-react-lite';
import { Button } from 'antd';
import {useHistory} from 'react-router-dom';

const AssignedProfile: FC<any> = () => {
  const {getIsLoggedIn,logout} = useMsal();
  const history = useHistory();

  const logoutAction = async (loginType:string) => {
    await logout(loginType);
    history.push({
      pathname: "/"
    });    
  }

  return (
    <>
      {getIsLoggedIn('passwordless')? 
      <>
        <div>Hello Passwordles Friend</div>
        <Button type="primary" onClick={() =>logoutAction('passwordless')}>Log Out</Button>
      </>
      : 
      <div>Goodby Stranger</div>
      }
    </>
  )
}

export default AssignedProfile;