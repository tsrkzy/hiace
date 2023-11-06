/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const isMacOS = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("mac") > 0 && ua.indexOf("os") > 0;
};
