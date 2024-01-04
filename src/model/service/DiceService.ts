/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/util/firestore";
import {
  type DiceColor,
  type DiceValue,
  DiceColors,
  DiceValues,
  DICE_SIZE,
} from "@/constant";
import { Dice } from "@/model/Dice";

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

export const fetchDice = async (diceId: string): Promise<Dice> => {
  const diceDoc = await getDoc(doc(db, "dice", diceId));
  if (!diceDoc.exists()) {
    throw new Error(`Dice ${diceId} not found`);
  }
  const d = diceDoc.data();
  return new Dice({
    id: diceDoc.id,
    room: d.room,
    board: d.board,
    owner: d.owner,
    color: d.color,
    face: d.face,
    hidden: d.hidden,
    transform: d.transform,
    updatedAt: d.updatedAt,
  });
};

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

export const changeDiceFace = async (props: {
  diceId: string;
  face: DiceValue;
}) => {
  await updateDice({ diceId: props.diceId, criteria: { face: props.face } });
};
export const rollDice = async (props: { diceId: string }) => {
  console.log("DiceService.rollDice", props);
  const n = Math.floor(Math.random() * 6);
  const diceValue = [
    DiceValues.ONE,
    DiceValues.TWO,
    DiceValues.THREE,
    DiceValues.FOUR,
    DiceValues.FIVE,
    DiceValues.SIX,
  ][n];
  await updateDice({ diceId: props.diceId, criteria: { face: diceValue } });
};
export const changeDiceColor = async (props: {
  diceId: string;
  color: DiceColor;
}) => {
  await updateDice({ diceId: props.diceId, criteria: { color: props.color } });
};
export const duplicateDice = async (props: { diceId: string }) => {
  const dice = await fetchDice(props.diceId);
  const { a, b, c, d, e, f } = new DOMMatrix(dice.transform);
  const transform = new DOMMatrix([a, b, c, d, e + DICE_SIZE, f + DICE_SIZE]);
  await createDice({
    roomId: dice.room,
    boardId: dice.board,
    userId: dice.owner,
    color: dice.color,
    face: dice.face,
    transform: `${transform}`,
  });
};
export const deleteDice = async (props: { diceId: string }) => {
  const collectionRef = collection(db, "dice");
  const docRef = doc(collectionRef, props.diceId);
  await deleteDoc(docRef);
};
