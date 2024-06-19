import { Base } from "./BaseRepository";

export class MemoryRepository extends Base {
  constructor(db: any) {
    super(db, "Memory");
  }
}
