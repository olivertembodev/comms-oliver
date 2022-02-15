/* eslint-disable react-hooks/exhaustive-deps */
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "lib/firebase";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";

export default function useNotifications() {
  const params = useParams();
  const post = params.post;
  const [user] = useAuthState(auth);
  const userDoc = doc(firestore, `users`, `${user?.uid ?? 'user'}`, 'notifications', post );
  const [value, loading] = useDocument(userDoc);  
  useEffect(() => {
    if (value?.id && !value.exists() && user?.uid) {
            setDoc(userDoc, {
               status: 'only when mentioned'
           });
       }
  }, [value]);

  const updateNotifications = (preference:string) => {
      updateDoc(userDoc, {
          status: preference,
      })
  }
  return {
    user,
    loading,
    updateNotifications,
    status: { notifications: value?.data()?.status ?? 'only when mentioned', id: value?.id ?? 'null' },
  }
}