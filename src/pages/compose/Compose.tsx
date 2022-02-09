/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { styled } from '@stitches/react';
import Container from 'components/Container';
import { Form } from 'components/shared/Form';
import { useFormik } from 'formik';
import { transformMentionDisplay } from 'lib';
import useUsers from 'hooks/useUsers';
import useChannel from 'hooks/useChannel';
import { channel } from 'diagnostics_channel';
import usePost from 'hooks/usePost';

const SuggesstionItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  '& > img': {
    marginRight: '8px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
});
const Wrapper = styled('div', {
  padding: '0px 16px',
  marginBottom: '24px',
});
const Heading4 = styled('h4', {
  color: '$secondary',
  fontSize: '40px',
  lineHeight: '36px',
  fontWeight: '500',
  margin: 0,
});
export const SelectedAChannel = styled('div', {
  width: '100%',
  borderRadius: '4px',
  marginBottom: '16px',
  fontSize: '18px',
  position: 'relative',
  color: '$secondary',
});
const DropDownIcon = styled('svg', {
  position: 'absolute',
  top: '18px',
  right: '8px',
});
const DropDown = styled('ul', {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: '0px',
  width: '100%',
  background: '$primary',
  maxHeight: '140px',
  overflowY: 'auto',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  zIndex: 2,
  listStyle: 'none',
  margin: 0,
  padding: 0,
});
const DropDownItem = styled('li', {
  padding: '8px 14px',
  background: 'white',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.07)',
  },
  variants: {
    isSelected: {
      true: {
        background: 'rgba(0, 0, 0, 0.14)',
      },
    },
  },
});
const ButtonWrapper = styled('div', {
  width: '100%',
  height: '100%',
  position: 'relative',
  margin: 0,
  textAlign: 'left',
  cursor: 'pointer',
  background: 'transparent',
  padding: '20px 16px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  fontSize: '18px',
  boxShadow: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  '&:hover': {
    border: '1px solid $secondary',
  },
  '& > p': {
    margin: 0,
    paddign: 0,
    marginRight: '8px',
  },
});
const Compose = () => {
  const { users } = useUsers();
  const [selectedChannels, setSelectedChannels] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const { results } = useChannel();
  const [showDropDown, setShowDropDown] = useState(false);
  const [postsDropDown, setPostsDropDown] = useState(false);
  const post = usePost(selectedChannels?.id ?? 'null');
  const selectedChannelPosts = post.results;
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      text: '',
    },
    onSubmit: (values, { resetForm }) => {
      //   create(values.subject, values.body);
      //   resetForm();
    },
  });
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };
  const togglePostsDropDown = () => {
    setPostsDropDown(!postsDropDown);
  };
  const toggleChannelSelection = (channel: {
    name: string;
    id: string;
    index: number;
  }) => {
    if (selectedChannels?.id === channel.id) {
      setSelectedChannels(null);
    } else {
      setSelectedChannels(channel);
    }
    setShowDropDown(false);
  };
  const togglePostSelected = (post: {
    body: string;
    id: string;
    index: number;
    subject: string;
  }) => {
    if (selectedPost?.id === post.id) {
      setSelectedPost(null);
    } else {
      setSelectedPost(post);
    }
    setPostsDropDown(false);
  };
  return (
    <Container>
      <div>
        <Wrapper>
          <Heading4>Compose a new message</Heading4>
        </Wrapper>
        <Form onSubmit={handleSubmit}>
          <SelectedAChannel>
            <ButtonWrapper onClick={toggleDropDown}>
              {!selectedChannels?.name
                ? 'Select A Channel'
                : selectedChannels.name}
              <DropDownIcon
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 15.3673L19.775 9.59229L21.4247 11.242L14 18.6666L6.57533 11.242L8.225 9.59229L14 15.3673Z"
                  fill="currentColor"
                ></path>
              </DropDownIcon>
            </ButtonWrapper>
            {showDropDown && (
              <DropDown>
                {results?.length
                  ? results.map((channel, index) => (
                      <DropDownItem
                        isSelected={selectedChannels?.id === channel.id}
                        onClick={() =>
                          toggleChannelSelection({ ...channel, index })
                        }
                        key={index}
                      >
                        {channel.name}
                      </DropDownItem>
                    ))
                  : null}
              </DropDown>
            )}
          </SelectedAChannel>
          <SelectedAChannel>
            <ButtonWrapper onClick={togglePostsDropDown}>
              {!selectedPost?.subject
                ? 'Select A Post'
                : selectedPost.subject}
              <DropDownIcon
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 15.3673L19.775 9.59229L21.4247 11.242L14 18.6666L6.57533 11.242L8.225 9.59229L14 15.3673Z"
                  fill="currentColor"
                ></path>
              </DropDownIcon>
            </ButtonWrapper>
            {postsDropDown && (
              <DropDown>
                {selectedChannelPosts?.length
                  ? selectedChannelPosts.map((post, index) => (
                      <DropDownItem
                        isSelected={selectedPost?.id === post.id}
                        onClick={() => togglePostSelected({ ...post, index })}
                        key={index}
                      >
                        {post.subject}
                      </DropDownItem>
                    ))
                  : null}
              </DropDown>
            )}
          </SelectedAChannel>
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
              renderSuggestion={({ display, image }) => (
                <SuggesstionItem>
                  <img src={image} alt={display} width={24} height={24} />
                  <p>{display}</p>
                </SuggesstionItem>
              )}
              data={users}
            ></Mention>
            <Mention
              trigger="@@"
              markup="@@[__display__](__id__)"
              appendSpaceOnAdd
              displayTransform={transformMentionDisplay}
              renderSuggestion={({ display, image }) => (
                <SuggesstionItem>
                  <img src={image} alt={display} width={24} height={24} />
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
};
export default Compose;
