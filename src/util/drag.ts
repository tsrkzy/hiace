/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const HIDE_BOARD_MAP_DRAGGING = "__hide_on_drag";

export const hideObstaclesToDrag = () => {
  Array.from(document.getElementsByClassName(HIDE_BOARD_MAP_DRAGGING)).forEach(
    (e: Element) => {
      if (e instanceof HTMLElement) {
        e.style.display = "none";
      }
    },
  );
};

export const showObstaclesToDrag = () => {
  Array.from(document.getElementsByClassName(HIDE_BOARD_MAP_DRAGGING)).forEach(
    (e: Element) => {
      if (e instanceof HTMLElement) {
        e.style.display = "";
      }
    },
  );
};
