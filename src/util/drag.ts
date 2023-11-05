/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const hideObstaclesToDrag = () => {
  Array.from(document.getElementsByClassName("__hide_on_drag")).forEach(
    (e: Element) => {
      if (e instanceof HTMLElement) {
        e.style.display = "none";
      }
    },
  );
};

export const showObstaclesToDrag = () => {
  Array.from(document.getElementsByClassName("__hide_on_drag")).forEach(
    (e: Element) => {
      if (e instanceof HTMLElement) {
        e.style.display = "";
      }
    },
  );
};
