/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export interface ContextMenuItemInit {
  value: string;
  text: string;
  callback?: (args: any[]) => Promise<any>;
  disabled?: boolean;
}

export interface ContextMenuItemParentInit extends ContextMenuItemInit {}
export interface ContextMenuItemChildInit extends ContextMenuItemInit {}

export class ContextMenuItem {
  value: string;
  text: string;
  callback: Function;
  disabled: boolean;
  constructor(args: ContextMenuItemInit) {
    const { value, text, callback, disabled } = args;
    this.value = value;
    this.text = text;
    this.callback =
      callback ??
      (() => {
        console.log("there is no callback");
      });
    this.disabled = disabled ?? false;
  }
}

export class ContextMenuParentItem extends ContextMenuItem {
  children: ContextMenuChildItem[];
  constructor(args: ContextMenuItemParentInit) {
    super(args);
    this.children = [];
  }
}
export class ContextMenuChildItem extends ContextMenuItem {
  constructor(args: ContextMenuItemChildInit) {
    super(args);
  }
}
