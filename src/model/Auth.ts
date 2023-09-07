type AuthProps = {
  id: string;
  name: string;
  photoUrl: string;
  email: string;
};

export class Auth {
  get ID(): string {
    return this._id;
  }

  set ID(value: string) {
    this._id = value;
  }
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

  private _id: string;
  private _name: string;
  private _photoUrl: string;
  private _email: string;

  constructor({ id, name, photoUrl, email }: AuthProps) {
    this._id = id;
    this._name = name;
    this._photoUrl = photoUrl;
    this._email = email;
  }

  get LoggedIn(): boolean {
    return !!this._name && !!this._email;
  }
}
