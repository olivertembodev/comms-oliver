import { addDoc, collection, serverTimestamp, orderBy, query, where } from "firebase/firestore";
import { auth, firestore } from "lib/firebase";
import { useParams } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from "react-firebase-hooks/auth";

export default function useMessage() {
  const [user] = useAuthState(auth);

  const params = useParams();
  const domain = params.domain;
  const channel = params.channel;
  const post = params.post
  const order = orderBy('time', 'asc');
  const queryMessages = where('originalPost', '==', false);
  const queryByPost = where('postID', '==', post);
  const col = query(collection(firestore, `channels`, `domain`, `${domain.replace("@","")}`, channel, "posts"), queryMessages, queryByPost ,order)
  const addCol = collection(firestore, `channels`, `domain`, `${domain.replace("@","")}`, channel, "posts")
  const [value, loading] = useCollection(col)
  const create = async (text:string, subject: string, channel: string) => {
    try {
      const docRef = await addDoc(addCol, {
        body: text,
        userId: user.uid,
        time: serverTimestamp(),
        originalPost: false,
        postID: post,
        subject,
        channel,
        user: {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }
      });

      return docRef;
    } catch (error) {
      throw error;
    }
  }

  const results = value?.docs?.map(doc => ({
    id: doc.id,
    body: doc.get("body"),
    user: doc.get("user")
  }))

  return {
    domain,
    create,
    loading,
    results: results || []
  }
}