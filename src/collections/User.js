import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

export class FSUser {
  static async getById({ id }) {
    const db = firebase.firestore();
    const docRef = await db.collection("user").doc(id).get();
    if (!docRef.exists) {
      return null;
    }
    const user = docRef.data();
    user.id = id;
    return user;
  }

  static async getByEmail({ email }) {
    const db = firebase.firestore();
    return db.collection("user")
      .where("email", "==", email).get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return null;
        }
        let result = null;
        snapshot.forEach((d) => {
          result = d.data();
          result.id = d.id;
        });
        return result;
      });
  }

  /**
   * get or create
   */
  static async create() {
    const db = firebase.firestore();
    const me = firebase.auth().currentUser;

    const email = me.email;
    const user = await FSUser.getByEmail({ email });

    if (user) {
      return user;
    }

    const u = {
      sys: { created: Date.now() },
      name: me.displayName,
      photoUrl: me.photoURL,
      email: me.email,
    };
    const ref = await db.collection("user").add(u);
    u.id = ref.id;

    return u;
  }
}