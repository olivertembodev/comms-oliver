import { auth } from "lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function useUser() {
  const [user] = useAuthState(auth);

  return {
    user,
  }
}