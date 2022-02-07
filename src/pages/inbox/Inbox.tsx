import { styled } from '../../lib/stitches.config';
import Container from 'components/Container';
import { Link } from 'react-router-dom';
import Button from 'components/shared/Button';
import useInbox from 'hooks/useInbox';
import { mentionsTextParser } from 'lib';

const Wrapper = styled('div', { paddingX: '16px' });
const Heading3 = styled('h3', {
  color: '$secondary',
  fontSize: '46px',
  lineHeight: '40px',
  fontWeight: '500',
  margin: 0,
});

const List = styled('ul', {
  padding: 0,
  margin: 0,
  marginTop: '24px',
});
const ListItem = styled('li', {
  margin: 0,
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  padding: '24px 0px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '& > a': {
    textDecoration: 'none',
  },
});
const ListItemTextWrapper = styled('div', {
  paddingX: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const PrimaryText = styled('p', {
  margin: '0',
  fontSize: '18px',
  color: '$secondary',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});
const SecondaryText = styled('p', {
  marginBottom: '0',
  marginTop: '4px',
  fontSize: '12px',
  color: '$secondary',
  fontWeight: '400',
  opacity: 0.75,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});
const ImagePlaceHolder = styled('div', {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  marginRight: '12px',
});
const UserImage = styled('img', {
  width: '40px',
  height: '40px',
  objectFit: 'cover',
  borderRadius: '50%',
  marginRight: '12px',
});
const ListWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const TextWrapper = styled('div', {
  width: '70%',
});
const EmptyMessage = styled('div', {
  height: '60vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& > p': {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '24px',
  },
});
const ButtonsWrapper = styled('div', {
  width: '20%',
});

export default function Inbox() {
  const { inbox, markMessageAsDone, loading } = useInbox();
  return (
    <Container>
      <div>
        <Wrapper>
          <Heading3>Inbox</Heading3>
        </Wrapper>
        <List>
          {inbox?.length ? (
            inbox.map((item, index) => {
              if (item.isDone) return null;
              return (
                <ListItem key={index}>
                  <Link to={`/@${item.domain}/${item.channel}/${item.post}`}>
                    <ListItemTextWrapper>
                      <ListWrapper>
                        {item.user.photoURL ? (
                          <UserImage
                            src={item.user.photoURL}
                            alt={item.user.displayName}
                            width={24}
                            height={24}
                          />
                        ) : (
                          <ImagePlaceHolder />
                        )}
                        <PrimaryText>{item.user.displayName}</PrimaryText>
                      </ListWrapper>
                      <TextWrapper>
                        <PrimaryText>{item.channelName ? `#${item.channelName}` : (item.subject ?? '') }</PrimaryText>
                        <SecondaryText
                          dangerouslySetInnerHTML={{
                            __html: mentionsTextParser(item.message).message,
                          }}
                        ></SecondaryText>
                      </TextWrapper>
                      <ButtonsWrapper>
                        {item.responseRequired ? (
                          <Button
                            danger
                            disabled
                            inactive
                            title="Response Requested"
                          >
                            Response Required
                          </Button>
                        ) : null}
                        <Button
                          onClick={(e) => markMessageAsDone(e, item, index)}
                        >
                          Mark as done
                        </Button>
                      </ButtonsWrapper>
                    </ListItemTextWrapper>
                  </Link>
                </ListItem>
              );
            })
          ) : (
            <EmptyMessage>
              {!loading ? <p>You have reached inbox 0!</p> : null}
            </EmptyMessage>
          )}
        </List>
      </div>
    </Container>
  );
}
