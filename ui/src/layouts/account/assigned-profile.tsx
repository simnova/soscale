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
      {getIsLoggedIn('assigned')? 
      <>
        <div>Hello Assigned Friend</div>
        <Button type="primary" onClick={() =>logoutAction('assigned')}>Log Out</Button>
      </>
      : 
      <div>Goodby Strangerr</div>
      }
    </>
  )
}

export default AssignedProfile;