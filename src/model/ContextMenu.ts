/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

interface ContextMenuItemProps {
  id: string;
  text: string;
  callback?: () => void|Promise<void>;
  children?: ContextMenuItem[];
  disabled?: boolean;
}

export class ContextMenuItem {
  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  get callback(): () => (void|Promise<void>) {
    return this._callback;
  }

  set callback(value: () => (void|Promise<void>)) {
    this._callback = value;
  }

  get children(): ContextMenuItem[] {
    return this._children;
  }

  set children(value: ContextMenuItem[]) {
    this._children = value;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  private _id: string;
  private _text: string;
  private _callback: () => void|Promise<void>;
  private _children: ContextMenuItem[];
  private _disabled: boolean;


  constructor(args: ContextMenuItemProps) {
    const { id, text, callback, children = [], disabled } = args;
    this._id = id;
    this._text = text;
    this._callback = callback ?? (() => console.log("there is no callback"));
    this._children = children;
    this._disabled = disabled ?? false;
  }
}

