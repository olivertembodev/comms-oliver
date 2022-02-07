import { useEffect } from 'react';
import { styled } from '../../lib/stitches.config';
import { useNavigate } from 'react-router-dom';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from 'lib/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import Button from '../../components/shared/Button';

const Wrapper = styled('div', {
  container: 'none',
  minHeight: '100vh',

})
const Form = styled('form', {
  background: '$primary',
  container: '480px',  
});

const Login = () => {
  const navigate = useNavigate();
  const [signInWithGoogle, user, loading] = useSignInWithGoogle(auth);

  useEffect(() => {
    if (user?.user) {
      const fetchUser = async () => {
        await getDoc(doc(firestore, 'users', user.user.uid)).then((user_doc) => {
          if (!user_doc.exists()) {
            setDoc(doc(firestore, 'users', user.user.uid), {
              email: user.user.email,
              displayName: user.user.displayName,
              photoURL: user.user.photoURL,
              domain: user.user.email.split("@")[1],
              notifications: 'only when mentioned',
            })
          }
        })
        const split = user.user.email.split("@")
        navigate(`/@${split[1]}`)
      };
      fetchUser();
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithGoogle()
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
          <Button type="submit" disabled={loading}>
            Login with Google
          </Button>
      </Form>
    </Wrapper>
  );
};

export default Login;
