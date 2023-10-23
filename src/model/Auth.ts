/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

type AuthProps = {
  name: string;
  photoUrl: string;
  email: string;
};

/**
 * GoogleAuthenticationについての、ユーザの認証情報を保持する
 * 操作中ユーザ単体の情報だけを保持する(<> Roomに参加しているユーザはUser)
 */
export class Auth {
  get Email(): string {
    return this._email;
  }

  set Email(value: string) {
    this._email = value;
  }

  get PhotoUrl(): string {
    return this._photoUrl;
  }

  set PhotoUrl(value: string) {
    this._photoUrl = value;
  }

  get Name(): string {
    return this._name;
  }

  set Name(value: string) {
    this._name = value;
  }

  private _name: string;
  private _photoUrl: string;
  private _email: string;

  /**
   * @param {AuthProps} args
   */
  constructor(args: AuthProps) {
    const { name, photoUrl, email } = args;
    this._name = name;
    this._photoUrl = photoUrl;
    this._email = email;
  }

  get LoggedIn(): boolean {
    return !!this._name && !!this._email;
  }
}
