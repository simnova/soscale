import { FC } from 'react';
import { useMsal } from '../../components/msal-react-lite';

const PasswordlessProfile: FC<any> = () => {
  const {getIsLoggedIn} = useMsal();

  return (
    <>
      {getIsLoggedIn('redirectconfig')? 
      <div>Hello Friend</div> 
      : 
      <div>Goodby Strangerr</div>
      }
    </>
  )
}

export default PasswordlessProfile;