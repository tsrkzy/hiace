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
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
  get photoUrl(): string {
    return this._photoUrl;
  }

  set photoUrl(value: string) {
    this._photoUrl = value;
  }
  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
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
