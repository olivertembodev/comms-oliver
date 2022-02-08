import useChannel from 'hooks/useChannel';
import { Link } from 'react-router-dom';
import { styled } from '../lib/stitches.config';
import { useFormik } from 'formik';
import { Form, InputField } from './shared/Form';
import { createAction, useRegisterActions } from 'kbar';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled('div', { paddingY: '16px' });
const List = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 300px)',
});
const ListItem = styled('li', {
  padding: '6px 24px',
  cursor: 'pointer',
  color: '$secondary',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  variants: {
    isSelected: {
      true: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
});
const HeadingWrapper = styled('p', {
  paddingX: '12px',
  color: '$secondary',
  fontSize: '18px',
  lineHeight: '24px',
  fontWeight: '600',
  paddingTop: '12px',
  marginTop: '0px',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
});

export default function ChannelList() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const { create, results, domain } = useChannel();
  const [selectedChannel, setSelectedChannel] = useState(0);
  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      channel: '',
    },
    onSubmit: (values, { resetForm }) => {
      create(values.channel);
      resetForm();
      inputRef.current.blur();
    },
  });
  const nextItem = () => {
    if (results.length > selectedChannel + 1) {
      setSelectedChannel(selectedChannel + 1);
      containerRef.current.scrollTop += 24;
    }
  };
  const previousItem = () => {
    if (selectedChannel) {
      setSelectedChannel(selectedChannel - 1);
      containerRef.current.scrollTop -= 24;
    }
  };
  useRegisterActions(
    [
      createAction({
        name: 'Move to next channel',
        shortcut: ['s'],
        keywords: 'next',
        perform: () => nextItem(),
      }),
      createAction({
        name: 'Move to previous channel',
        shortcut: ['w'],
        keywords: 'previous',
        perform: () => previousItem(),
      }),
      createAction({
        name: 'Goto Selected Channel',
        shortcut: ['g', 'c'],
        keywords: 'channel',
        perform: () => results?.length ? navigate(`/${domain}/${results[selectedChannel].id}`) : null,
      }),
      createAction({
        name: 'Add a new channel',
        shortcut: ['a', 'c'],
        keywords: 'channel',
        perform: () => inputRef.current.focus(),
      }),
    ],
    [selectedChannel, results, inputRef],
  );
  return (
    <Wrapper>
      <HeadingWrapper>Channels:</HeadingWrapper>
      <List ref={containerRef}>
        {results.map((item, index) => (
          <ListItem key={item.id} isSelected={index === selectedChannel}>
            <Link to={`/${domain}/${item.id}`}>#{item.name}</Link>
          </ListItem>
        ))}
      </List>
      <Form onSubmit={handleSubmit}>
        <InputField
          ref={inputRef}
          placeholder="Input new channel"
          name="channel"
          required
          onChange={handleChange}
          value={values.channel}
        />
      </Form>
    </Wrapper>
  );
}
