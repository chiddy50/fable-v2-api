import { Base } from "./BaseRepository";

export class SessionRepository extends Base {
  constructor(db: any) {
    super(db, "Session");
  }
}
