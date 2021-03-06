import { addDoc, collection, query, serverTimestamp, where } from "firebase/firestore";
import { auth, firestore } from "lib/firebase";
import { useParams } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from "react-firebase-hooks/auth";

export default function usePost(channelId: string) {
  const [user] = useAuthState(auth);

  const params = useParams();
  const domain = params.domain;
  const channel = channelId;
  const queryPosts = where('originalPost', '==', true);
  const col = query(collection(firestore, `channels`, `domain`, `${domain.replace("@","")}`, channel, "posts"), queryPosts);
  const toAddCol = collection(firestore, `channels`, `domain`, `${domain.replace("@","")}`, channel, "posts");
  const [value, loading] = useCollection(col)
  const create = async (subject:string, body: string) => {
    try {
      const docRef = await addDoc(toAddCol, {
        subject,
        body,
        time: serverTimestamp(),
        originalPost: true,
        userId: user.uid,
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
    subject: doc.get("subject"),
  }))

  return {
    domain,
    channel,
    create,
    loading,
    results: results || []
  }
}