import { addDoc, collection, serverTimestamp, orderBy, query } from "firebase/firestore";
import { auth, firestore } from "lib/firebase";
import { useParams } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from "react-firebase-hooks/auth";

export default function useMessage() {
  const [user] = useAuthState(auth);

  const params = useParams();
  const domain = params.domain;
  const channel = params.channel;
  const post = params.post;
  const order = orderBy('time', 'asc');
  const col = query(collection(firestore, `channels`, `domain`, `${domain.replace("@","")}`, channel, "posts", post, "messages"), order)
  const addCol = collection(firestore, `channels`, `domain`, `${domain.replace("@","")}`, channel, "posts", post, "messages")
  const [value, loading] = useCollection(col)
  
  const create = async (text:string) => {
    try {
      const docRef = await addDoc(addCol, {
        text,
        userId: user.uid,
        time: serverTimestamp(),
        user: {
          name: user.displayName,
          email: user.email,
        }
      });

      return docRef;
    } catch (error) {
      throw error;
    }
  }

  const results = value?.docs?.map(doc => ({
    id: doc.id,
    text: doc.get("text"),
    user: doc.get("user")
  }))

  return {
    domain,
    create,
    loading,
    results: results || []
  }
}