/* eslint-disable react-hooks/exhaustive-deps */
import { MentionsInput, Mention } from 'react-mentions';
import { styled } from '../../lib/stitches.config';
import Container from 'components/Container';
import { useFormik } from 'formik';
import useMessage from 'hooks/useMessage';
import useUser from 'hooks/useUser';
import NotificationIcon from 'assets/images/Alarm_Icon.png';
import useSinglePost from 'hooks/useSinglePost';
import { Form } from '../../components/shared/Form';
import '../../styles/mentions.css';
import { useContext, useEffect, useRef, useState } from 'react';
import useUsers from 'hooks/useUsers';
import { mentionsTextParser, transformMentionDisplay } from 'lib';
import useChannel from 'hooks/useChannel';
import { GlobalContext } from 'context/GlobalState';
import Button from 'components/shared/Button';
import useNotifications from 'hooks/useNotifications';

const Wrapper = styled('div', {
  paddingLeft: '16px',
  paddingRight: '36px',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
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
  width: '40%',
  borderRadius: '8px',
  padding: '8px 4px',
  paddingTop: '0px',
});
const Heading3 = styled('h3', {
  color: '$secondary',
  fontSize: '46px',
  lineHeight: '40px',
  fontWeight: '500',
  margin: 0,
});
const Heading5 = styled('h5', {
  color: '$secondary',
  fontSize: '24px',
  lineHeight: '20px',
  fontWeight: '400',
  paddingX: '16px',
  margin: 0,
  marginTop: '32px',
});
const SubHeading = styled('p', {
  color: '$secondary',
  fontSize: '18px',
  lineHeight: '16px',
  fontWeight: '400',
  margin: 0,
  marginTop: '16px',
});

const List = styled('ul', {
  padding: 0,
  margin: 0,
  marginTop: '32px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  paddingY: '4px',
  maxHeight: 'calc(100vh - 320px)',
  overflowY: 'auto',
  listStyle: 'none',
});

const ListItem = styled('li', {
  margin: 0,
  padding: '16px 0px',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
});
const ListItemTextWrapper = styled('div', { paddingX: '24px' });
const PrimaryText = styled('p', {
  margin: '0',
  fontSize: '18px',
  color: '$secondary',
  fontWeight: '500',
});
const SecondaryText = styled('p', {
  marginBottom: '0',
  marginTop: '6px',
  fontSize: '14px',
  color: '$secondary',
  fontWeight: '300',
  opacity: 0.7,
});
const SuggesstionItem = styled('div', {
  display: 'flex', 
  alignItems: 'center',
  '& > img': {
    marginRight: '8px',
    borderRadius: '50%',
    objectFit: 'cover',
  }
})

export default function Message() {
  const { value } = useSinglePost();
  const [notificationsDropDown, setNotificationsDropDown] = useState(false);
  const toggleNotificationsDropDown = () => {
    setNotificationsDropDown(!notificationsDropDown);
  };
  const { results, create } = useMessage();
  const { currentChannel } = useChannel();
  const { selectedComponent, setSelectedComponent }  = useContext(GlobalContext);
  const { status, updateNotifications } = useNotifications();
  const messagesContainerRef = useRef(null);
  const { users } = useUsers();
  const { user } = useUser();
  const scrollToBottom = () => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  };
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { text: '' },
    onSubmit: (values, { resetForm }) => {
      create(values.text, value?.subject, currentChannel[0].name);
      resetForm();
      scrollToBottom();
    },
  });

  useEffect(() => {
    if (messagesContainerRef?.current) {
      scrollToBottom();
    }
  }, [results]);

  useEffect(() => {
    if (selectedComponent?.includes('inbox')) {
      setSelectedComponent('container-eyebrow');
    }
  }, []);

  return (
    <Container>
      <div>
        <Wrapper>
          <div>
          <Heading3>{value?.subject}</Heading3>
          <SubHeading>Body: {value?.body}</SubHeading>
          </div>
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
              <Button onClick={() => updateNotifications('only when mentioned')} id="notifications-only-when-mentioned" inactive isActiveComponent={selectedComponent === 'notifications-only-when-mentioned'}>
                Only When Mentioned{' '}
                {status.notifications === 'only when mentioned'
                  ? ' (selected)'
                  : ''}
              </Button>
              <Button onClick={() => updateNotifications('all posts')} id="notifications-all-posts" inactive isActiveComponent={selectedComponent === 'notifications-all-posts'}>
                All Posts{' '}
                {status.notifications === 'all posts'
                  ? ' (selected)'
                  : ''}
              </Button>
            </DropDown>
          ) : null}
        </Wrapper>
        <Heading5>Message</Heading5>
        <List ref={messagesContainerRef}>
          {results.map((item) => (
            <ListItem key={item.id} id={item.id}>
              <ListItemTextWrapper>
                <PrimaryText
                  dangerouslySetInnerHTML={{
                    __html: mentionsTextParser(item.body).message,
                  }}
                ></PrimaryText>
                <SecondaryText>{`From: ${
                  item.user?.name === user.displayName
                    ? 'You'
                    : item.user?.name || ''
                }`}</SecondaryText>
              </ListItemTextWrapper>
            </ListItem>
          ))}
        </List>
        <Form onSubmit={handleSubmit}>
          <MentionsInput
            singleLine={true}
            value={values.text}
            onChange={(e: { target: object }) =>
              handleChange({ target: { name: 'text', ...e.target } })
            }
            placeholder="Message"
            className="message-mentions-input"
            required
            autoFocus
          >
            <Mention
              trigger="@"
              appendSpaceOnAdd
              displayTransform={transformMentionDisplay}
              renderSuggestion={({ display, image }) =>
            <SuggesstionItem>
              <img src={image} alt={display} width={24} height={24}/>
              <p>{display}</p>
            </SuggesstionItem>
            }
              data={users}
            ></Mention>
            <Mention
              trigger="@@"
              markup="@@[__display__](__id__)"
              appendSpaceOnAdd
              displayTransform={transformMentionDisplay}
              renderSuggestion={({ display, image }) => (
                <SuggesstionItem>
                <img src={image} alt={display} width={24} height={24}/>
                <p>{display}</p>
              </SuggesstionItem>
              )}
              data={users}
            ></Mention>
          </MentionsInput>
        </Form>
      </div>
    </Container>
  );
}
