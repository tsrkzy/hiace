/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { get } from "svelte/store";
import { useFloats } from "../store/floats";
import { ContentId, ContentTitle, Float, type FloatArgs } from "../Float";

const { floats, setFloats } = useFloats();

export const popFloat = (floatId: number) => {
  const floatList = get(floats);
  const sorted = reassignFloatZIndex(floatId, floatList);

  if (sorted) {
    setFloats(floatList);
  }
};

const reassignFloatZIndex = (floatId: number, floatList: Float[]): boolean => {
  const maxZ = Math.max(...floatList.map(f => f.z));

  /* 対象のIDの項目を探し、zにmaxZをセットする
   * 既にmaxZならばなにもしない */
  const targetIndex = floatList.findIndex(item => item.id === floatId);
  if (floatList[targetIndex].z === maxZ) {
    return false;
  }
  floatList[targetIndex].z = maxZ;

  /* floatListのidがfloatIdでない項目を探索し、zが重複しないように上に詰める */
  floatList
    .filter(item => item.id !== floatId)
    .sort((a, b) => a.z - b.z)
    .forEach((item, index) => {
      item.z = index + 1;
    });
  return true;
};

export const closeFloat = (floatId: number) => {
  const floatList = get(floats);
  setFloats(floatList.filter(f => f.id !== floatId));
};

export const openFloat = (
  contentId: ContentId,
  option: { contentTitle?: string; args?: FloatArgs } = {
    contentTitle: "",
    args: {},
  },
) => {
  const newId = Math.max(0, ...get(floats).map(f => f.id)) + 1;
  const float = new Float({
    id: newId,
    show: true,
    contentId,
    contentTitle: option.contentTitle || ContentTitle(contentId),
    x: 300,
    y: 300,
    w: 300,
    h: 300,
    z: newId,
    args: option.args,
  });
  const floatList = [...get(floats), float];
  reassignFloatZIndex(newId, floatList);

  setFloats(floatList);
};
