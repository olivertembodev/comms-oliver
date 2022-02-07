/* eslint-disable array-callback-return */
import { collection, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { firestore } from 'lib/firebase';
import { auth } from 'lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function useInbox() {
  const [user] = useAuthState(auth);
  const [results, setResults] = useState([]);
  const [messagesInInbox, setMessagesInInbox] = useState(0);

  const orderInbox = orderBy('time', 'desc');
  const orderByResponses = orderBy('responseRequired', 'desc');
  const col = query(
    collection(firestore, `users`, `${user?.uid ?? 'user'}`, `inbox`),
    orderByResponses,
    orderInbox,
  );

  const [value, loading] = useCollection(col);
  useEffect(() => {
    if (value?.docs.length) {
      let results = [];
      value?.docs?.map((doc) => {
        if (!doc.data().isDone) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });
      setResults(results);
      setMessagesInInbox(results.length);
    } else setMessagesInInbox(0);
  }, [value]);

  const markMessageAsDone = async (
    e: React.MouseEvent,
    item: { id: string },
    index: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    let messages = [...results];
    messages[index].isDone = true;
    messages.splice(index, 1);
    setResults([...messages]);
    setMessagesInInbox(messagesInInbox - 1);
    await deleteDoc(doc(firestore, 'users', user.uid, 'inbox', item.id));
  };
  return {
    loading,
    inbox: results || [],
    messagesInInbox,
    markMessageAsDone,
  };
}
