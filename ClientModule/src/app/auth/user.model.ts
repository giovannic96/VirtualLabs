export class User {
  public email: string;
  public iat: number;
  public exp: number;
  public sub : string;

  constructor(email: string, iat: number, exp: number, sub: string) {
    this.email = email;
    this.iat = iat;
    this.exp = exp;
    this.sub = sub;
  }
}
