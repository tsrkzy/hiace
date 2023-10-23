import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Auth } from "../model/Auth";

export const authenticateWithPopUp = async (): Promise<Auth> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getAuth(), provider).then(r => {
    console.log("logged in");
    const {
      user: { displayName, photoURL, email },
    } = r;
    return new Auth({
      name: displayName || "",
      photoUrl: photoURL || "",
      email: email || "",
    });
  });
};
