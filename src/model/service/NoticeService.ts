/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { Notice } from "../Notice";
import { useNotices } from "../store/notices";

const { addNotice, removeNotice } = useNotices();

export const createNotice = (text: string) => {
  console.log("NoticeService.createNotice");
  const notice = new Notice({ text, level: 0 });
  const { id } = notice;
  addNotice(notice);
  window.setTimeout(() => {
    console.log("delete notice");
    removeNotice(id);
  }, 4000);
};
