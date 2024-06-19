export interface IBase {
  create(data: object): Promise<object>;
  update(data: object): Promise<object>;
  delete(filter: object): Promise<object>;
  getUnique(filter: object): Promise<object>;
  get(filter: object): Promise<object>;
  getAll(filter: object): Promise<Array<object>>;
  count(filter: object): Promise<number>;
}

export class Base implements IBase {
  private modelName: string;
  private db: any;

  constructor(db: any, modelName: string) {
    this.db = db;
    this.modelName = modelName;
  }

  public create = async (data: object): Promise<object> => {
    return await this.db[this.modelName].create(data);
  };

  public update = async (data: object): Promise<object> => {
    return await this.db[this.modelName].update(data);
  };

  public delete = async (filter: object): Promise<object> => {
    return await this.db[this.modelName].delete(filter);
  };

  public getUnique = async (filter: object): Promise<object> => {
    return await this.db[this.modelName].findUnique(filter);
  };

  public get = async (filter: object): Promise<object> => {
    return await this.db[this.modelName].findFirst(filter);
  };

  public getAll = async (filter: object): Promise<Array<object>> => {
    return await this.db[this.modelName].findMany(filter);
  };

  public count = async (filter: object): Promise<number> => {
    return await this.db[this.modelName].count({ where: filter });
  };
}
