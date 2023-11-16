/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/util/firestore";
import { useDices } from "@/model/store/dices";
import { Dice } from "@/model/Dice";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function DiceListener() {
  const { setDices } = useDices();

  const setDiceListener = (roomId: string) => {
    console.log("setDiceListener");
    const q = query(collection(db, "dice"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const dices: Dice[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const dice = new Dice({
          id: doc.id,
          name: d.name,
        });
        dices.push(dice);
      });
      setDices(dices);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setDiceListener };
}
