import { FC } from 'react';
import { useMsal } from '../../components/msal-react-lite';

const AssignedProfile: FC<any> = () => {
  const {getIsLoggedIn} = useMsal();

  return (
    <>
      {getIsLoggedIn('popupconfig')? 
      <div>Hello Friend</div> 
      : 
      <div>Goodby Strangerr</div>
      }
    </>
  )
}

export default AssignedProfile;