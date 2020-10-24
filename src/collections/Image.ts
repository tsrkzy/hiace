import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

import store from "@/store";

export const DEFAULT_MAP_IMAGE = "3xAeZFAnozZsODuCs9XC";
export const DEFAULT_CHARACTER_IMAGE = "wG5tOfKAW3trnsApUNRy";

export class FSImage {
  static unsubscribeMap = new Map();

  static async GetById({ id }: { id: string }) {
    const db = firebase.firestore();
    const docRef = await db
      .collection("image")
      .doc(id)
      .get();
    if (!docRef.exists) {
      return null;
    }
    const image = docRef.data();

    return { id, ...image };
  }

  static async GetImageMetadata(
    file: File
  ): Promise<{ width: Number; height: Number }> {
    const url: string = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const { width, height } = image;
        resolve({ width, height });
      };
      image.onerror = e => {
        reject(e);
      };
      image.src = url;
    });
  }

  static async Create(file?: File | null) {
    if (!(file instanceof File)) {
      throw new Error(`argument must be instance of File()`);
    }

    /* 画像ファイル取得 */
    const { width, height } = await FSImage.GetImageMetadata(file);

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
      const uploadTask = imageRef.put(file, metadata);
      uploadTask.on(
        "state_changed",
        snapshot => {
          /* progress observer */
          console.log(`uploading ${name},`, snapshot.state); // @DELETEME
        },
        e => {
          /* on error */
          reject(e);
        },
        async () => {
          /* on complete */
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          console.log("uploading done: ", name); // @DELETEME
          resolve(url);
        }
      );
    });

    const image = {
      path,
      url,
      tags: [],
      owner: userId,
      room: roomId,
      hidden: false,
      width,
      height
    };
    const db = firebase.firestore();
    const imageDocRef = await db.collection("image").add(image);
    const id = imageDocRef.id;
    console.log(`+ register done. "${name}" complete!`); // @DELETEME

    return { id, ...image };
  }

  static SetListener(roomId: string) {
    console.log("Image.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSImage;
    if (unsubscribeMap.has(roomId)) {
      FSImage.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("image").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const images: any[] = [];
      querySnapshot.forEach(doc => {
        const image = doc.data();
        image.id = doc.id;
        images.push(image);
      });
      store.dispatch("image/setImages", { images });
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId: string) {
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
