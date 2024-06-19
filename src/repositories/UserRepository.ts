import { Base } from "./BaseRepository";

export class UserRepository extends Base {
  constructor(db: any) {
    super(db, "User");
  }
}
