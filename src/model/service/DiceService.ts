/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/


import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/util/firestore";

interface UpdateDiceProps {
  diceId: string;
  criteria: object;
}

export const updateDice = async (props: UpdateDiceProps) => {
  const { diceId, criteria } = props;
  const collectionRef = collection(db, "dice");
  const docRef = doc(collectionRef, diceId);
  await updateDoc(docRef, criteria);
};


export const touchDice = async (props: { diceId: string }) => {
  const { diceId } = props;
  await updateDice({ diceId, criteria: { updatedAt: Date.now() } });
};
