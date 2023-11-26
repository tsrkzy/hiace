/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/util/firestore";

export const deleteColumn = async (props: { columnId: string }) => {
  const { columnId } = props;
  console.log("ColumnService.deleteColumn", columnId);
  const collectionRef = collection(db, "column");
  const docRef = doc(collectionRef, columnId);
  await deleteDoc(docRef);
}