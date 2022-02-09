import { styled } from '../../lib/stitches.config';
import Container from 'components/Container';
import { useFormik } from 'formik';
import usePost from 'hooks/usePost';
import useSingleChannel from 'hooks/useSingleChannel';
import { Link, useParams } from 'react-router-dom';
import Button from 'components/shared/Button';
import { Form, InputField, TextArea } from 'components/shared/Form';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAction, useRegisterActions } from 'kbar';

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
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '& > a': {
    textDecoration: 'none',
  },
  variants: {
    isSelected: {
      true: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
    },
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
  const navigate = useNavigate();
  const params = useParams();
  const { results, create, domain, channel } = usePost(params.domain);
  const [selectedPost, setSelectedPost] = useState(0);
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
  const previousItem = () => {
    if (selectedPost) {
      setSelectedPost(selectedPost - 1);
    }
  };
  const nextItem = () => {
    if (results.length > selectedPost + 1) {
      setSelectedPost(selectedPost + 1);
    }
  };
  
  useRegisterActions(
    [
      createAction({
        name: 'Move to next post',
        shortcut: ['x'],
        keywords: 'next',
        perform: () => nextItem(),
      }),
      createAction({
        name: 'Move to previous post',
        shortcut: ['z'],
        keywords: 'previous',
        perform: () => previousItem(),
      }),
      createAction({
        name: 'Goto Selected Post',
        shortcut: ['g', 'p'],
        keywords: 'selected-post',
        perform: () => results?.length ? navigate(`/${domain}/${channel}/${results[selectedPost].id}`) : null,
      }),
      createAction({
        name: 'Add a new post',
        shortcut: ['a', 'p'],
        keywords: 'post',
        perform: () => inputRef.current.focus(),
      }),
    ],
    [selectedPost, results],
  );

  return (
    <Container>
      <div>
        <Wrapper>
          <Heading4>#{value?.name}</Heading4>
        </Wrapper>
        <List>
          {results.map((item, index) => (
            <ListItem key={item.id} isSelected={index === selectedPost}>
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
