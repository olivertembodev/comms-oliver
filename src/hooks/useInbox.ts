import { collection, arrayRemove, updateDoc, doc } from 'firebase/firestore';
import { firestore } from 'lib/firebase';
import { auth } from 'lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function useInbox() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [results, setResults] = useState([]);

  const col = collection(firestore, `users`, `${user?.uid ?? 'user'}`, `inbox`);

  const [value, loading] = useCollection(col);

  useEffect(() => {
    if (value?.docs.length) {
      const results = value?.docs?.map((doc) => ({
        id: doc.id,
        messages: doc.data().messages,
      }));
      setResults(results);
      if (results?.length) {
        setMessages(results[0].messages);
      }
    }
  }, [value]);

  const markMessageAsDone = async (
    e: React.MouseEvent,
    item: object,
    index: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    let tempMessages = [...messages];
    tempMessages.splice(index, 1);
    setMessages([...tempMessages]);
    await updateDoc(doc(firestore, 'users', user.uid, 'inbox', user.uid), {
      messages: arrayRemove(item),
    });
  };
  return {
    loading,
    inbox: results || [],
    messages,
    markMessageAsDone,
  };
}
