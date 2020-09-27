import firebase from "firebase/app";
import  "firebase/firestore";
import  "firebase/storage";

import store from "@/store";

export class FSImage {
  static unsubscribeMap = new Map();

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
    /* 画像ファイル情報 */
    const name = file.name;
    const size = file.size;
    const contentType = file.type;

    /* owner, roomId */
    const user = store.getters["auth/user"];
    const userId = user.id;

    const room = store.getters["room/info"];
    const roomId = room.id;

    /* fireStorage.path */
    const path = `${userId}/images/${name}`;


    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(path);

    const metadata = {
      name,
      size,
      contentType
    };
    const url = await new Promise((resolve, reject) => {
      /* upload */
      const uploadTask = imageRef.put(file, metadata)
      uploadTask.on("state_changed", (snapshot) => {
        /* progress observer */
        console.log(`uploading ${name},`,snapshot.state); // @DELETEME
      }, (e) => {
        /* on error */
        reject(e);
      }, async () => {
        /* on complete */
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
      room: roomId,
      hidden: false
    };
    const db = firebase.firestore();
    const imageDocRef = await db.collection("image").add(image);
    image.id = imageDocRef.id;
    console.log(`+ register done. "${name}" complete!`); // @DELETEME
    return image
  }

  static SetListener(roomId) {
    console.log("Image.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSImage;
    if (unsubscribeMap.has(roomId)) {
      FSImage.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("image")
      .where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot((querySnapshot) => {
      const images = [];
      querySnapshot.forEach((doc) => {
        const image = doc.data();
        image.id = doc.id;
        images.push(image);
      });
      store.dispatch("image/setChats", { images });
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId) {
    const { unsubscribeMap } = FSImage;
    if (!unsubscribeMap.has(roomId)) {
      console.log("no listener found: ", roomId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(roomId);
    listener.unsubscribe();

    unsubscribeMap.delete(roomId);
  }

}