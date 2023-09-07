import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AuthStore } from "../model/store/AuthStore";

export const authenticateWithPopUp = async (): Promise<AuthStore> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getAuth(), provider).then(r => {
    console.log("logged in");
    const {
      user: { displayName, photoURL, email },
    } = r;
    return new AuthStore({
      name: displayName || "",
      photoUrl: photoURL || "",
      email: email || "",
    });
  });
};
