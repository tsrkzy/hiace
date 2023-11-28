/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/util/firestore";
import { Note } from "@/model/Note";

interface CreateNoteProps {
  room: string;
  name: string;
  text: string;
}

export const createNote = async (props: CreateNoteProps): Promise<Note> => {
  const { room, name, text } = props;

  const collectionRef = collection(db, "note");
  const docRef = doc(collectionRef);

  await setDoc(docRef, {
    name,
    room,
    text,
  });

  return new Note({
    id: docRef.id,
    name,
    room,
    text,
  });
};

interface updateNoteProps {
  noteId: string;
  criteria: object;
}

export const updateNote = async (props: updateNoteProps) => {
  const { noteId, criteria } = props;
  const collectionRef = collection(db, "note");
  const docRef = doc(collectionRef, noteId);
  await updateDoc(docRef, criteria);
};

interface deleteNoteProps {
  noteId: string;
}

export const deleteNote = async (props: deleteNoteProps) => {
  const { noteId } = props;
  const collectionRef = collection(db, "note");
  const docRef = doc(collectionRef, noteId);
  await deleteDoc(docRef);
};
