/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { styled } from '../lib/stitches.config';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'lib/firebase';
import ChannelList from 'components/ChannelList';
import { signOut } from 'firebase/auth';

const Wrapper = styled('div', {
  container: 'none',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  backgroundColor: '$primary',
});
const SideBar = styled('div', {
  minHeight: '100vh',
  position: 'fixed',
  inset: '0px auto 0px 0px',
  backgroundColor: '$primary',
  zIndex: '50',
  paddingY: '24px',
  paddingX: '0px',
  width: '392px',
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
})
const TopBar = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingX: '12px',
})
const Eyebrow = styled('p', {
  fontSize: '16px',
  lineHeight: '24px',
  color: '$secondary',
  margin: 0,
})
const LogoutButton = styled('button', {
  background: '$danger',
  fontSize: '14px',
  color: '$primary',
  padding: '4px 10px',
  borderRadius: '4px',
  minWidth: '64px',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.8',
  }
})

const ChildrenWrapper = styled('div', {
  background: '$primary',
  padding: '24px 0px',
  marginLeft: '392px',
  width: '100%',
})

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
    <Wrapper>
      <SideBar>
        <TopBar>
          <Eyebrow>{domain}</Eyebrow>
          <LogoutButton
            onClick={handleLogout}
            type="submit"
          >
            Logout
          </LogoutButton>
        </TopBar>
        <ChannelList />
      </SideBar>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Wrapper>
  );
}
