/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

const camelToKebabCase = (str: string) => {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}
export const toCSS = (o: { [key: string]: string|number|null|undefined }): string => {
  let s = "";

  for (let i = 0; i < Object.entries(o).length; i++) {
    const [_k, v] = Object.entries(o)[i]
    if ((v === null) || typeof v === "undefined") {
      continue
    }

    const k = camelToKebabCase(_k)
    const style = `${k}: ${v};`
    s = s + style;
  }
  return s;
}