/* eslint-disable react-hooks/exhaustive-deps */
import 'styles/chat.css';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'lib/firebase';
import ChannelList from 'components/ChannelList';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { signOut } from 'firebase/auth';

export default function Container({ children }) {
  const navigate = useNavigate();
  const params = useParams();
  const domain = params.domain;
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }

    if (user && `@${user.email.split('@')[1]}` !== params.domain) {
      navigate('/');
    }
  }, [user, loading]);

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-top">
          <Typography>{domain}</Typography>
          <Button
            onClick={handleLogout}
            type="submit"
            variant="contained"
            size="small"
            color="error"
          >
            Logout
          </Button>
        </div>
        <ChannelList />
      </div>
      <div>{children}</div>
    </div>
  );
}
