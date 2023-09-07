type UserProps = {
  id: string;
  color: string;
  email: string;
  name: string;
  photoUrl: string;
  lastPing: Date;
  joinTo: string[];
};

export class User {
  get ID(): string {
    return this._id;
  }

  set ID(value: string) {
    this._id = value;
  }
  get Color(): string {
    return this._color;
  }

  set Color(value: string) {
    this._color = value;
  }

  get Email(): string {
    return this._email;
  }

  set Email(value: string) {
    this._email = value;
  }

  get Name(): string {
    return this._name;
  }

  set Name(value: string) {
    this._name = value;
  }

  get PhotoUrl(): string {
    return this._photoUrl;
  }

  set PhotoUrl(value: string) {
    this._photoUrl = value;
  }

  get LastPing(): Date {
    return this._lastPing;
  }

  set LastPing(value: Date) {
    this._lastPing = value;
  }

  get JoinTo(): string[] {
    return this._joinTo;
  }

  set JoinTo(value: string[]) {
    this._joinTo = value;
  }

  private _id: string;
  private _color: string;
  private _email: string;
  private _name: string;
  private _photoUrl: string;
  private _lastPing: Date;
  private _joinTo: string[];

  constructor({ id, color, email, name, photoUrl, lastPing, joinTo }: UserProps) {
    this._id = id;
    this._color = color;
    this._email = email;
    this._name = name;
    this._photoUrl = photoUrl;
    this._lastPing = lastPing;
    this._joinTo = joinTo;
  }
}
