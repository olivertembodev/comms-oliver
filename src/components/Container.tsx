/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { styled } from '../lib/stitches.config';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { auth } from 'lib/firebase';
import ChannelList from 'components/ChannelList';
import { signOut } from 'firebase/auth';
import useInbox from 'hooks/useInbox';
import NotificationIcon from '../assets/images/Alarm_Icon.png';
import useUser from 'hooks/useUser';
import Button from './shared/Button';
import { useRegisterActions, createAction } from 'kbar';
import { GlobalContext } from 'context/GlobalState';

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
});
const TopBar = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingX: '12px',
});
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
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  variants: {
    isActiveComponent: {
      true: {
        backgroundColor: 'rgba(0,0,0,0.20)',
      }
    }
  }
});
const Eyebrow = styled('p', {
  fontSize: '16px',
  lineHeight: '24px',
  color: '$secondary',
  margin: 0,
  padding: '0px 4px',
  variants: {
    isActiveComponent: {
      true: {
        backgroundColor: 'rgba(0,0,0,0.20)',
      }
    }
  }
});
const ChildrenWrapper = styled('div', {
  background: '$primary',
  padding: '24px 0px',
  marginLeft: '392px',
  zIndex: '0',
  width: '100%',
});
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
});
const NotificationsButton = styled('button', {
  padding: '2px',
  margin: 0,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  variants: {
    isActiveComponent: {
      true: {
        backgroundColor: 'rgba(0,0,0,0.20)',
      }
    }
  }
});
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
});

export default function Container({ children }) {
  const navigate = useNavigate();
  const params = useParams();
  const domain = params.domain;
  const {
    selectedComponent,
    elementsList,
    setElementsList,
    setSelectedComponent,
  } = useContext(GlobalContext);
  const [user, loading] = useAuthState(auth);
  const { messagesInInbox } = useInbox();
  const { userDetails, updateNotificationPreferences } = useUser();
  const [notificationsDropDown, setNotificationsDropDown] = useState(false);
  const toggleNotificationsDropDown = () => {
    setNotificationsDropDown(!notificationsDropDown);
  };
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
  const selectPreviousElement = () => {
    const indexOfCurrentElement = elementsList.indexOf(selectedComponent);
    if (indexOfCurrentElement) {
      setSelectedComponent(elementsList[indexOfCurrentElement - 1]);
      if (elementsList[indexOfCurrentElement - 1] === 'notifications-only-when-mentioned' || elementsList[indexOfCurrentElement - 1] === 'notifications-all-posts') {
        if (!notificationsDropDown) {
          toggleNotificationsDropDown();          
        }
      } else {
        setNotificationsDropDown(false);
      }
    }
  }
  const selecteNextElement = () => {
    const indexOfCurrentElement = elementsList.indexOf(selectedComponent);
    if (indexOfCurrentElement > -1 && indexOfCurrentElement < elementsList.length - 1) {
      setSelectedComponent(elementsList[indexOfCurrentElement + 1]);
      if (elementsList[indexOfCurrentElement + 1] === 'notifications-only-when-mentioned' || elementsList[indexOfCurrentElement + 1] === 'notifications-all-posts') {
        if (!notificationsDropDown) {
          toggleNotificationsDropDown();          
        }
      } else {
        setNotificationsDropDown(false);
      }
    }
  }
  const performSelectedAction = () => {
    switch (selectedComponent) {
      case 'container-eyebrow': {
        navigate(`/${domain}`);
        break;
      }
      case 'inbox-link': {
        navigate(`/${params.domain}/inbox/${user?.uid}`)
        break;
      }
      case 'notifications-toggle': {
        toggleNotificationsDropDown();
        break;
      }
      case 'notifications-only-when-mentioned': {
        updateNotificationPreferences('only when mentioned');
        return;
      }
      case 'notifications-all-posts': {
        updateNotificationPreferences('all posts');
        return;
      }
      default: {
        if (selectedComponent.includes('channel-')) {
          navigate(`/${domain}/${selectedComponent.replace('channel-', '')}`);
        } else if (selectedComponent.includes('inbox-') && selectedComponent.includes('post-')) {
          const channel = selectedComponent.substring(6, selectedComponent.indexOf('-',6));
          const domainIndex = selectedComponent.indexOf('-domain-');
          const postIndex = selectedComponent.indexOf('-post-');
          const indexIndex = selectedComponent.indexOf('-index-');
          const domain = selectedComponent.substring(domainIndex + 8, selectedComponent.indexOf('-', postIndex));
          const post = selectedComponent.substring(postIndex + 6, selectedComponent.indexOf('-', indexIndex))
          navigate(`/@${domain}/${channel}/${post}`);
        } else if (selectedComponent.includes('--pid--')) {
          const postID = selectedComponent.substring(7, selectedComponent.indexOf('-', 7));
          navigate(`/${params.domain}/${params.channel}/${postID}`);
        }
      }
    }
  };
  useRegisterActions(
    [
      createAction({
        name: 'Compose a new message',
        shortcut: ['c'],
        keywords: 'compose',
        perform: () => navigate(`/${domain}/compose`),
      }),
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
        shortcut: ['r'],
        keywords: 'preferences',
        perform: () => toggleNotificationsDropDown(),
      }),
      createAction({
        name: 'Set notifications to only when mentioned',
        shortcut: ['m', 'n'],
        keywords: 'only-when-mentioned',
        perform: () => updateNotificationPreferences('only when mentioned'),
      }),
      createAction({
        name: 'Set notifications to all posts',
        shortcut: ['a', 'n'],
        keywords: 'all-posts',
        perform: () => updateNotificationPreferences('all posts'),
      }),
      createAction({
        name: 'Go Back',
        shortcut: ['<'],
        keywords: 'back',
        perform: () => navigate(-1),
      }),
      createAction({
        name: 'Previous Item',
        shortcut: ['p'],
        keywords: 'previous-item',
        perform: () => selectPreviousElement(),
      }),
      createAction({
        name: 'Next Item',
        shortcut: ['n'],
        keywords: 'next-item',
        perform: () => selecteNextElement(),
      }),
      createAction({
        name: 'Select current selection',
        shortcut: ['enter'],
        keywords: 'Enter',
        perform: () => performSelectedAction(),
      })
    ],
    [user, params, notificationsDropDown, userDetails, elementsList, selectedComponent],
  );
  useEffect(() => {
    const elements = [
      'container-eyebrow',
      'inbox-link',
      'notifications-toggle',
      'notifications-only-when-mentioned',
      'notifications-all-posts',
    ];
    let tempElementsList = elementsList;
    elements.map((element) => {
      if (!elementsList.includes(element)) {
        tempElementsList.push(element);
      }
    })
    setElementsList([...tempElementsList]);
    if (!selectedComponent || selectedComponent === 'login-button') {
      setSelectedComponent(tempElementsList[0]);
    }
  }, []);
  return (
    <Wrapper>
      <SideBar>
        <TopBar>
          <Eyebrow isActiveComponent={selectedComponent === 'container-eyebrow'} id="container-eyebrow">Comms</Eyebrow>
        </TopBar>
        <LinkWrapper isActiveComponent={selectedComponent === 'inbox-link'}>
          <Link id="inbox-link" to={`/${domain}/inbox/${user?.uid}`}>
            Inbox -{' '}
            <InboxCountViewer>{messagesInInbox ?? '0'}</InboxCountViewer>
          </Link>
          <NotificationsButton
            id="notifications-toggle"
            isActiveComponent={selectedComponent === 'notifications-toggle'}
            onClick={toggleNotificationsDropDown}
          >
            <img
              src={NotificationIcon}
              width={28}
              height={28}
              alt="Edit notification permissions"
            />
          </NotificationsButton>
          {notificationsDropDown ? (
            <DropDown>
              <Button id="notifications-only-when-mentioned" inactive isActiveComponent={selectedComponent === 'notifications-only-when-mentioned'}>
                Only When Mentioned{' '}
                {userDetails?.notifications === 'only when mentioned'
                  ? ' (selected)'
                  : ''}
              </Button>
              <Button id="notifications-all-posts" inactive isActiveComponent={selectedComponent === 'notifications-all-posts'}>
                All Posts{' '}
                {userDetails?.notifications === 'all posts'
                  ? ' (selected)'
                  : ''}
              </Button>
            </DropDown>
          ) : null}
        </LinkWrapper>
        <ChannelList />
      </SideBar>
      {children ? <ChildrenWrapper>{children}</ChildrenWrapper> : null}
    </Wrapper>
  );
}
