import {
  collection,
  setDoc,
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../util/firestore";
import { Pawn } from "../Pawn";

const DEFAULT_CHARACTER_IMAGE = "default_character_image";

interface CreatePawnProps {
  roomId: string;
  userId: string;
  boardId: string;
  imageId: string;
  characterId: string;
  transform?: string | DOMMatrix;
}

export const createPawn = async (props: CreatePawnProps) => {
  const { roomId, userId, boardId, imageId, characterId, transform } = props;
  const p = {
    room: roomId,
    owner: userId,
    board: boardId,
    image: imageId ?? DEFAULT_CHARACTER_IMAGE,
    character: characterId,
    transform: `${transform ?? new DOMMatrix()}`,
    updatedAt: Date.now(),
  };

  const collectionRef = collection(db, "pawn");
  const docRef = doc(collectionRef);
  await setDoc(docRef, p);

  const { id } = docRef;

  return new Pawn({
    id,
    room: p.room,
    owner: p.owner,
    board: p.board,
    image: p.image,
    character: p.character,
    transform: p.transform,
  });
};

export const deletePawn = async (props: { pawnId: string }) => {
  const { pawnId } = props;

  const collectionRef = collection(db, "pawn");
  const docRef = doc(collectionRef, pawnId);
  await deleteDoc(docRef);
};

export const deletePawnByBoard = async (props: { boardId: string }) => {
  const { boardId } = props;

  const batch = writeBatch(db);
  const collectionRef = collection(db, "pawn");

  const q = query(collectionRef, where("board", "==", boardId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(d => batch.delete(d.ref));

  await batch.commit();
};

export const updatePawnTransfer = async (props: {
  pawnId: string;
  transform: string | DOMMatrix;
}) => {
  console.log("PawnService.updatePawnTransfer");
  const { pawnId, transform } = props;

  const collectionRef = collection(db, "pawn");
  const docRef = doc(collectionRef, pawnId);
  await updateDoc(docRef, { transform: `${transform}` });

  const docSnap = await getDoc(docRef);
  const d = docSnap.data() as Pawn;

  return new Pawn({
    id: docRef.id,
    room: d.room,
    owner: d.owner,
    board: d.board,
    image: d.image,
    character: d.character,
    transform: d.transform,
  });
};

export const touchPawn = async (props: { pawnId: string }) => {
  const { pawnId } = props;

  const collectionRef = collection(db, "pawn");
  const docRef = doc(collectionRef, pawnId);
  await updateDoc(docRef, { updatedAt: Date.now() });
};
