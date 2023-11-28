/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { writable } from "svelte/store";
import { Note } from "@/model/Note";

const notes = writable<Note[]>([]);

notes.subscribe(a => {
  console.log("notes.subscribe", a); // @DELETEME
});

export const useNotes = () => {
  return {
    setNotes: notes.set,
    notes,
  };
};
