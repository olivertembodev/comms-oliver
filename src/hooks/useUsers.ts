/* eslint-disable array-callback-return */
import { collection, query, where } from 'firebase/firestore';
import { firestore } from 'lib/firebase';
import { auth } from 'lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';

export default function useUsers() {
  const params = useParams();
  const domain = params.domain;

  const [user] = useAuthState(auth);
  const [users, setUsers] = useState([]);

  const queryInbox = where('domain', '==', domain.split('@')[1]);
  const queryInboxByOtherUsers = where('email', '!=', user?.email ?? 'null');
  const col = query(
    collection(firestore, `users`),
    queryInbox,
    queryInboxByOtherUsers,
  );

  const [value, loading] = useCollection(col);
  useEffect(() => {
    if (value?.docs.length) {
      let results = [];
      value?.docs?.map((doc) => {
        results.push({ id: doc.id, display: doc.data().displayName, image: doc.data().photoURL });
      });
      setUsers(results);
    }
  }, [value]);

  return {
    loading,
    users: users || [],
  };
}
