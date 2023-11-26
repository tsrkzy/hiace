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
import { Column, type ColumnDataType } from "@/model/Column";

interface createColumnProps {
  roomId: string;
  tableId: string;
  label: string;
  dataType: ColumnDataType;
  order: number;
}

export const createColumn = async (props: createColumnProps) => {
  const { roomId, tableId, label, dataType, order } = props;
  console.log("ColumnService.createColumn", roomId, tableId, label);
  const collectionRef = collection(db, "column");

  const docRef = doc(collectionRef);
  await setDoc(docRef, {
    room: roomId,
    table: tableId,
    label,
    show: true,
    dataType,
    refPath: "",
    dataMap: {},
    order,
  });

  return new Column({
    id: docRef.id,
    room: roomId,
    table: tableId,
    label,
    show: true,
    dataType,
    refPath: "",
    dataMap: {},
    order,
  });
};

interface updateColumnProps {
  columnId: string;
  criteria: object;
}

export const updateColumn = async (props: updateColumnProps) => {
  const { columnId, criteria } = props;
  console.log("ColumnService.updateColumn", columnId, criteria);
  const collectionRef = collection(db, "column");
  const docRef = doc(collectionRef, columnId);
  await updateDoc(docRef, criteria);
};

export const deleteColumn = async (props: { columnId: string }) => {
  const { columnId } = props;
  console.log("ColumnService.deleteColumn", columnId);
  const collectionRef = collection(db, "column");
  const docRef = doc(collectionRef, columnId);
  await deleteDoc(docRef);
};
