import { addDoc, collection } from "firebase/firestore";
import { auth, firestore } from "lib/firebase";
import { useParams } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from "react-firebase-hooks/auth";

export default function useChannel() {
  const [user] = useAuthState(auth);

  const params = useParams();
  const domain = params.domain;
  const channel = params.channel;
  const col = collection(firestore, `channels`, `domain`, `${domain.replace("@","")}`)
  
  const [value, loading] = useCollection(col)
  
  const create = async (name:string) => {
    try {
      const docRef = await addDoc(col, {
        name,
        userId: user.uid,
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
    name: doc.get("name")
  }))

  const currentChannel = results?.filter((item) => item.id === channel);;

  return {
    domain,
    create,
    loading,
    results: results || [],
    currentChannel,
  }
}