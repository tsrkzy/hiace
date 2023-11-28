/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/util/firestore";
import { useNotes } from "@/model/store/notes";
import { Note } from "@/model/Note";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function NoteListener() {
  const { setNotes } = useNotes();
  const setNoteListener = (roomId: string) => {
    console.log("setNoteListener");
    const q = query(collection(db, "note"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const notes: Note[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const note = new Note({
          id: doc.id,
          name: d.name,
          room: d.room,
          text: d.text,
        });
        notes.push(note);
      });
      setNotes(notes);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setNoteListener };
}
