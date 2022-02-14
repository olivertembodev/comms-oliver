/* eslint-disable array-callback-return */
import { GlobalContext } from 'context/GlobalState';
import { collection, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { firestore } from 'lib/firebase';
import { auth } from 'lib/firebase';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function useInbox() {
  const [user] = useAuthState(auth);
  const [results, setResults] = useState([]);
  const { selectedComponent, setSelectedComponent, elementsList, setElementsList } = useContext(GlobalContext);
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

  const markMessageAsDone = async () => {
    if (selectedComponent.includes('inbox-') && selectedComponent.includes('-post-') && selectedComponent.includes('-index-')) {
      const indexOfLastIndex = selectedComponent.lastIndexOf('-');
      const index = selectedComponent.substring(indexOfLastIndex + 1, selectedComponent.length);
      const id = results[index].id;
      let messages = [...results];
      messages[index].isDone = true;
      messages.splice(index, 1);
      setResults([...messages]);
      setMessagesInInbox(messagesInInbox - 1);
      const indexOfSelectedItem = elementsList.indexOf(selectedComponent);
      const tempElemList = [...elementsList];
      tempElemList.splice(indexOfSelectedItem, 1);
      if (tempElemList.length) {
        setSelectedComponent(tempElemList[indexOfSelectedItem - 1]);
      }
      const currentItems = tempElemList.filter((item) => !(item.includes('inbox-') && item.includes('-post-') && item.includes('-index-')));
      setElementsList([...currentItems]);
      await deleteDoc(doc(firestore, 'users', user.uid, 'inbox', id));

    }
  };
  return {
    loading,
    inbox: results || [],
    messagesInInbox,
    markMessageAsDone,
  };
}
