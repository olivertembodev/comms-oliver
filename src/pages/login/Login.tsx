import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/form.css';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from 'lib/firebase';
import Button from '@mui/material/Button';
import { setDoc, doc } from 'firebase/firestore';

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
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="button-wrapper">
          <Button fullWidth variant="contained" type="submit" disabled={loading}>
            Login with Google
          </Button>
        </div>
      </form>
    </>
  );
};

export default Login;
