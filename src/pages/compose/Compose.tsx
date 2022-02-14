/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { styled } from '@stitches/react';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import Container from 'components/Container';
import { Form, InputField, TextArea } from 'components/shared/Form';
import { useFormik } from 'formik';
import useChannel from 'hooks/useChannel';
import 'styles/mentions.css';
import { firestore } from 'lib/firebase';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { uid } from 'uid';
import useUser from 'hooks/useUser';
import { useState } from 'react';

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
const animatedComponents = makeAnimated();
const Compose = () => {
  const { suggesstions } = useChannel();
  const params = useParams();
  const { user } = useUser();
  const [toList, setToList] = useState([]);
  const domain = params.domain;
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      subject: '',
      body: '',
    },
    onSubmit: (values, { resetForm }) => {
      if (toList.length && values.subject.length && values.body.length) {
        const batch = writeBatch(firestore);
        toList.map((recipient) => {
          const document = doc(
            firestore,
            `channels`,
            `domain`,
            `${domain.replace('@', '')}`,
            recipient.value,
            'posts',
            uid(),
          );
          batch.set(document, {
            subject: values.subject,
            body: values.body,
            time: serverTimestamp(),
            originalPost: true,
            userId: user.uid,
            user: {
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            },
          });
        });
        batch.commit();
        resetForm();
        setToList([]);
      }
    },
  });
  return (
    <Container>
      <div>
        <Wrapper>
          <Heading4>Add a new post</Heading4>
        </Wrapper>
        <Form onSubmit={handleSubmit}>
          <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          value={toList}
          isMulti
          onChange={(value) => setToList(value)}
          placeholder="To"
          options={suggesstions}
        />
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
            onKeyDown={e => {
              if (e.keyCode === 13) {
                handleSubmit();
                return false;
              }
            }}
            name="body"
            onChange={handleChange}
            value={values.body}
          />
          <input type="submit" hidden />
        </Form>
      </div>
    </Container>
  );
};
export default Compose;
