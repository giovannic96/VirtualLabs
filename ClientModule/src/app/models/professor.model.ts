import {User} from "./user.model";

export class Professor extends User {

  constructor(id: string, username: string, password: string, name: string,
              surname: string, photo: string, roles: string[]) {
    super(id, username, password, name, surname, photo, roles);
  }
}
