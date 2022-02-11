/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { MentionsInput, Mention } from 'react-mentions';
import { styled } from '@stitches/react';
import Container from 'components/Container';
import { Form, InputField, TextArea } from 'components/shared/Form';
import { useFormik } from 'formik';
import { ToListParser } from 'lib';
import useChannel from 'hooks/useChannel';
import 'styles/mentions.css';
import { firestore } from 'lib/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { uid } from 'uid';
import useUser from 'hooks/useUser';
import { createAction, useRegisterActions } from 'kbar';

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
const Compose = () => {
  const { suggesstions } = useChannel();
  const params = useParams();
  const { user } = useUser();
  const domain = params.domain;
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      to: '',
      subject: '',
      body: '',
    },
    onSubmit: (values, { resetForm }) => {
      const toList = ToListParser(values.to).recipientsList;
      if (toList.length) {
        const batch = writeBatch(firestore);
        toList.map((recipient) => {
          const document = doc(
            firestore,
            `channels`,
            `domain`,
            `${domain.replace('@', '')}`,
            recipient.channelID,
            'posts',
            uid(),
          );
          batch.set(document, {
            subject: values.subject,
            body: values.body,
            userId: user.uid,
            user: {
              name: user.displayName,
              email: user.email,
            },
          });
        });
        batch.commit();
        resetForm();
      }
    },
  });
  const onAddToSendList = (
    id: string,
    display: string,
    startPos: number,
    endPos: number,
  ) => {
    if (values.to.includes(id)) {
      const removedElem = values.to.substring(startPos, endPos);
      handleChange({
        target: { name: 'to', value: values.to.replace(removedElem, '') },
      });
    }
  };
  useRegisterActions([
    createAction({
      name: 'Submit Post',
      shortcut: ['h', 's'],
      keywords: 'submit',
      perform: () => handleSubmit(),
    }),
  ], []);

  return (
    <Container>
      <div>
        <Wrapper>
          <Heading4>Add a new post</Heading4>
        </Wrapper>
        <Form onSubmit={handleSubmit}>
          <MentionsInput
            singleLine={true}
            value={values.to}
            onChange={(e: { target: object }) =>
              handleChange({ target: { name: 'to', ...e.target } })
            }
            placeholder="To"
            className="message-mentions-input"
            required
          >
            <Mention
              trigger="#"
              onAdd={onAddToSendList}
              appendSpaceOnAdd
              renderSuggestion={({ display }) => (
                <SuggesstionItem>
                  <p>{display}</p>
                </SuggesstionItem>
              )}
              data={suggesstions}
            ></Mention>
          </MentionsInput>
          <InputField
            placeholder="Subject"
            spacedTop
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
        </Form>
      </div>
    </Container>
  );
};
export default Compose;
