/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { styled } from '../lib/stitches.config';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import {Link} from 'react-router-dom';
import { auth } from 'lib/firebase';
import ChannelList from 'components/ChannelList';
import { signOut } from 'firebase/auth';
import useInbox from 'hooks/useInbox';
import NotificationIcon from '../assets/images/Alarm_Icon.png';
import useUser from 'hooks/useUser';
import Button from './shared/Button';
import { useRegisterActions, createAction } from 'kbar';

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
  zIndex: '0',
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
const LinkWrapper = styled('div', {
  width: '100%',
  paddingX: '12px',
  marginTop: '12px',
  position: 'relative',
  paddingY: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  '& > a': {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '16px',
    color: '$secondary',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  }
})
const Eyebrow = styled('p', {
  fontSize: '16px',
  lineHeight: '24px',
  color: '$secondary',
  margin: 0,
})
const ChildrenWrapper = styled('div', {
  background: '$primary',
  padding: '24px 0px',
  marginLeft: '392px',
  zIndex: '0',
  width: '100%',
})
const InboxCountViewer = styled('div', {
  borderRadius: '50%',
  background: '$danger',
  width: '28px',
  height: '28px',
  color: '$primary',
  marginLeft: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
const NotificationsButton = styled('button', {
  padding: 0,
  margin: 0,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
})
const DropDown = styled('div', {
  position: 'absolute',
  top: '40px',
  right: 0,
  background: '$primary',
  border: '1px solid $secondary',
  width: '70%',
  borderRadius: '8px',
  padding: '8px 4px',
  paddingTop: '0px',
})

export default function Container({ children }) {
  const navigate = useNavigate();
  const params = useParams();
  const domain = params.domain;
  const [user, loading] = useAuthState(auth);
  const { messagesInInbox } = useInbox();
  const { userDetails, updateNotificationPreferences } = useUser();
  const [notificationsDropDown ,setNotificationsDropDown] = useState(false);
  const toggleNotificationsDropDown = () => {
    setNotificationsDropDown(!notificationsDropDown);
  }
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
  useRegisterActions([
    createAction({
      name: 'Goto Inbox',
      shortcut: ['g', 'i'],
      keywords: 'inbox',
      perform: () => navigate(`/${params.domain}/inbox/${user?.uid}`),
    }),
    createAction({
      name: 'Logout',
      shortcut: ['l', 'o'],
      keywords: 'logout',
      perform: () => handleLogout(),
    }),
    createAction({
      name: 'Notifications and Preferences',
      shortcut: ['n', 'p'],
      keywords: 'preferences',
      perform: () => toggleNotificationsDropDown(),
    }),
    createAction({
      name: 'Set notifications to only when mentioned',
      shortcut: ['n', 'm'],
      keywords: 'only-when-mentioned',
      perform: () => updateNotificationPreferences('only when mentioned'),
    }),
    createAction({
      name: 'Set notifications to all posts',
      shortcut: ['n', 'a'],
      keywords: 'all-posts',
      perform: () => updateNotificationPreferences('all posts'),
    }),
    createAction({
      name: 'Go Back',
      shortcut: ['<'],
      keywords: 'back',
      perform: () => navigate(-1),
    }),
  ], [user, params, notificationsDropDown, userDetails]);
  return (
    <Wrapper>
      <SideBar>
        <TopBar>
          <Eyebrow>Comms</Eyebrow>
        </TopBar>
        <LinkWrapper>
          <Link to={`/${domain}/inbox/${user?.uid}`}>
            Inbox - <InboxCountViewer>{messagesInInbox ?? '0'}</InboxCountViewer>
          </Link>
          <NotificationsButton onClick={toggleNotificationsDropDown}>
            <img src={NotificationIcon} width={28} height={28} alt="Edit notification permissions"/>
          </NotificationsButton>
          { notificationsDropDown ?(
          <DropDown>
            <Button inactive>Only When Mentioned {userDetails?.notifications === 'only when mentioned' ? ' (selected)' : ''}</Button>
            <Button inactive>All Posts {userDetails?.notifications === 'all posts' ? ' (selected)' : ''}</Button>
          </DropDown>) : null}
        </LinkWrapper>
        <ChannelList />
      </SideBar>
      {children ? <ChildrenWrapper>{children}</ChildrenWrapper> : null}
    </Wrapper>
  );
}
