import { useEffect } from 'react';
import { styled } from '../../lib/stitches.config';
import { useNavigate } from 'react-router-dom';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from 'lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
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
      setDoc(doc(firestore, 'users', user.user.uid), {
        email: user.user.email,
        displayName: user.user.displayName,
        photoURL: user.user.photoURL,
      })
      const split = user.user.email.split("@")
      navigate(`/@${split[1]}`)
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
