/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { styled } from '../../lib/stitches.config';
import Container from 'components/Container';
import { useFormik } from 'formik';
import usePost from 'hooks/usePost';
import useSingleChannel from 'hooks/useSingleChannel';
import { Link, useParams } from 'react-router-dom';
import Button from 'components/shared/Button';
import { Form, InputField, TextArea } from 'components/shared/Form';
import { useContext, useEffect, useRef } from 'react';
import { createAction, useRegisterActions } from 'kbar';
import { GlobalContext } from 'context/GlobalState';

const Wrapper = styled('div', {
  paddingX: '16px',
  marginBottom: '24px',
});
const Heading4 = styled('h4', {
  color: '$secondary',
  fontSize: '40px',
  lineHeight: '36px',
  fontWeight: '500',
  margin: 0,
});
const List = styled('ul', {
  padding: 0,
  margin: 0,
  listStyle: 'none',
});

const ListItem = styled('li', {
  margin: 0,
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  padding: '24px 0px',
  '& > a': {
    textDecoration: 'none',
  },
  variants: {
    isActiveComponent: {
      true: {
        backgroundColor: 'rgba(0,0,0,0.20)',
        borderRadius: '4px',
      }
    }
  },
});
const ListItemTextWrapper = styled('div', { paddingX: '24px' });
const PrimaryText = styled('p', {
  margin: '0',
  fontSize: '18px',
  color: '$secondary',
  fontWeight: '500',
  textDecoration: 'underline',
});
const SecondaryText = styled('p', {
  marginBottom: '0',
  marginTop: '6px',
  fontSize: '14px',
  color: '$secondary',
  fontWeight: '400',
  opacity: 0.8,
  textDecoration: 'none',
});
export default function Post() {
  const params = useParams();
  const { results, create, domain, channel, loading } = usePost(params.channel);
  const { elementsList, selectedComponent, setElementsList, setSelectedComponent } = useContext(GlobalContext);
  const inputRef = useRef(null);
  const { value } = useSingleChannel();
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      subject: '',
      body: '',
    },
    onSubmit: (values, { resetForm }) => {
      create(values.subject, values.body);
      resetForm();
    },
  });
  useRegisterActions(
    [
      createAction({
        name: 'Add a new post',
        shortcut: ['a', 'p'],
        keywords: 'post',
        perform: () => inputRef.current.focus(),
      }),
    ],
    [inputRef],
  );
  useEffect(() =>{
    if (results?.length) {
      let tempElementsList = [...elementsList.filter((item) => !item.includes('-post-') && !item.includes('--pid--'))];
      results.map((post, index) => {
          const postID = `--pid--${post.id}-i-${index}`;
          tempElementsList.push(postID);
      });
      setSelectedComponent(tempElementsList[tempElementsList.length - results.length]);
      setElementsList([...tempElementsList]);
    }
  },[loading])

  return (
    <Container>
      <div>
        <Wrapper>
          <Heading4>#{value?.name}</Heading4>
        </Wrapper>
        <List>
          {results.map((item, index) => (
            <ListItem key={item.id} isActiveComponent={selectedComponent === `--pid--${item.id}-i-${index}`}>
              <Link to={`/${domain}/${channel}/${item.id}`}>
                <ListItemTextWrapper>
                  <PrimaryText>{item.subject}</PrimaryText>
                  <SecondaryText>{item.body}</SecondaryText>
                </ListItemTextWrapper>
              </Link>
            </ListItem>
          ))}
        </List>
        <Form onSubmit={handleSubmit}>
          <InputField
            placeholder="Subject"
            ref={inputRef}
            required
            name="subject"
            onChange={handleChange}
            value={values.subject}
          />
          <TextArea
            placeholder="Body"
            rows={6}
            required
            name="body"
            onChange={handleChange}
            value={values.body}
          />
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    </Container>
  );
}
