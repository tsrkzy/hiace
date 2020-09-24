import firebase from "firebase/app";
import  "firebase/firestore";
import  "firebase/storage";

import store from "@/store";

export class FSImage {
  static async GetById({ id }) {
    const db = firebase.firestore();
    const docRef = await db.collection("image").doc(id).get();
    if (!docRef.exists) {
      return null;
    }
    const image = docRef.data();
    image.id = docRef.id;
    return image;
  }

  static async Create(file){
    if (!(file instanceof File)) {
      throw new Error(`argument must be instance of File()`);
    }
    const name = file.name;
    const size = file.size;
    const contentType = file.type;

    const user = store.getters["auth/user"];
    const userId = user.id;

    const path = `${userId}/images/${name}`;
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(path);

    const metadata = {
      name,
      size,
      contentType
    };
    const url = await new Promise((resolve, reject) => {
      const uploadTask = imageRef.put(file, metadata)
      uploadTask.on("state_changed", (snapshot) => {
        /* observer */
        console.log(`uploading ${name},`,snapshot.state); // @DELETEME
      }, (e) => {
        reject(e);
      }, async () => {
        const url = await uploadTask.snapshot.ref.getDownloadURL();
        console.log("uploading done: ",name); // @DELETEME
        resolve(url)
      });
    });

    const image = {
      path,
      url,
      tags: [],
      owner: userId,
      hidden: false
    };
    const db = firebase.firestore();
    const imageDocRef = await db.collection("image").add(image);
    image.id = imageDocRef.id;
    console.log(`+ register done. "${name}" complete!`); // @DELETEME
    return image
  }

}