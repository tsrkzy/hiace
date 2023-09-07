type AuthStoreProps = {
  name: string;
  photoUrl: string;
  email: string;
};

export class AuthStore {
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

  constructor({ name, photoUrl, email }: AuthStoreProps) {
    this._name = name;
    this._photoUrl = photoUrl;
    this._email = email;
  }

  get LoggedIn(): boolean {
    return !!this._name && !!this._email;
  }
}
