import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";

export default function useUser() {
  const [user] = useAuthState(auth);
  const userDoc = doc(firestore, `users`, `${user?.uid ?? 'user'}` );
  const [value, loading] = useDocument(userDoc);

  const updateNotificationPreferences = (preference: string) => {
    if (preference === value.data().notifications) return;
    updateDoc(userDoc, {
      notifications: preference,
    });
  }
  return {
    user,
    loading,
    updateNotificationPreferences,
    userDetails: { notifications: value?.data()?.notifications ?? 'only when mentioned', id: value?.id ?? 'n/a' },
  }
}