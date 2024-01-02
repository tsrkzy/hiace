/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/util/firestore";
import {
  type DiceColor,
  type DiceValue,
  DiceColors,
  DiceValues,
} from "@/constant";

interface createDiceProps {
  roomId: string;
  boardId: string;
  userId: string;
  color?: DiceColor;
  face?: DiceValue;
  hidden?: boolean;
  transform?: string;
  updatedAt?: number | Date;
}

export const createDice = async (props: createDiceProps) => {
  const {
    roomId,
    boardId,
    color = DiceColors.DICE_WHITE,
    face = DiceValues.ONE,
    userId,
    transform,
    updatedAt = Date.now(),
  } = props;
  const collectionRef = collection(db, "dice");
  const docRef = doc(collectionRef);
  const data = {
    room: roomId,
    board: boardId,
    color,
    face,
    owner: userId,
    hidden: false,
    transform: `${transform ?? new DOMMatrix()}`,
    updatedAt,
  };
  await setDoc(docRef, data);
};

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
