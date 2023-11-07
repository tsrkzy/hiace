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
  const maxZ = floatList.length;

  /* zの降順かつ対象を最前列に */
  floatList.sort((a, b) =>
    a.id === floatId ? -1 : b.id === floatId ? 1 : a.z < b.z ? 1 : -1,
  );

  for (let i = 0; i < floatList.length; i++) {
    const f = floatList[i];
    f.z = maxZ - i;
  }

  setFloats(floatList);
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
  const newId = Math.max(...get(floats).map(f => f.id)) + 1;
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
  setFloats([...get(floats), float]);
};
