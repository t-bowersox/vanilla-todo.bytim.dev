import { DatabaseServiceInterface } from "./database-service.interface";

export class IndexedDBService implements DatabaseServiceInterface {
  constructor(
    private databaseName: string,
    private databaseVersion: number,
    private objectStoreSchema: Array<ObjectStoreInterface>
  ) {}

  private db?: IDBDatabase;

  public open(): Promise<boolean> {
    if (this.db) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(this.databaseName, this.databaseVersion);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };
      request.onerror = () => {
        console.log(`Error opening database: ${request.error?.message}`);
        resolve(false);
      };
      request.onblocked = () => {
        console.log(`Error opening database: ${request.error?.message}`);
        resolve(false);
      };
      request.onupgradeneeded = () => {
        this.initObjectStores(request);
        // Fires onsuccess handler after creating stores
      };
    });
  }

  private initObjectStores(request: IDBOpenDBRequest): void {
    const db = request.result;
    this.objectStoreSchema.forEach((schema) => {
      if (db.objectStoreNames.contains(schema.name)) {
        return;
      }
      const store = db.createObjectStore(schema.name, schema?.options);
      this.initStoreIndexes(store, schema?.indexes);
    });
  }

  private initStoreIndexes(
    store: IDBObjectStore,
    indexes: ObjectIndexInterface[] = []
  ): void {
    indexes.forEach((index) => {
      store.createIndex(index.name, index.keyPath, index?.params);
    });
  }

  public close(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.db) {
        console.log("Error closing database: connection not opened.");
        resolve(false);
      }
      resolve(true);
    });
  }

  public create<T>(
    record: T,
    collection: string
  ): Promise<string | number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject("Unable to create record: no open database.");
      }

      const transaction = this.db.transaction([collection], "readwrite");
      const store = transaction.objectStore(collection);
      const request = store.add(record);
      let newKey: string | number;
      request.onsuccess = () => (newKey = request.result as string | number);
      transaction.oncomplete = () => resolve(newKey);
      transaction.onerror = () => reject(transaction.error?.message);
    });
  }

  public read<T>(
    collection: string,
    query?: string | number,
  ): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject("Unable to read records: no open database");
      }

      const transaction = this.db.transaction([collection], "readonly");
      const store = transaction.objectStore(collection);
      const request: IDBRequest<T[]> = store.getAll(query);
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error?.message);
    });
  }

  public async update<T>(
    recordId: string | number,
    data: T,
    collection: string
  ): Promise<boolean> {
    const records = await this.read<T>(collection, recordId);
    if (!records.length) {
      return Promise.resolve(false);
    }

    const record = records[0];
    for (const prop in data) {
      record[prop] = data[prop];
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject("Unable to update records: no open database");
      }

      const transaction = this.db.transaction([collection], "readwrite");
      transaction.objectStore(collection).put(record);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error?.message);
    });
  }

  public delete(
    recordId: string | number,
    collection: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject("Unable to delete records: no open database");
      }

      const transaction = this.db.transaction([collection], "readwrite");
      transaction.objectStore(collection).delete(recordId);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error?.message);
    });
  }
}

export interface ObjectStoreInterface {
  name: string;
  options?: IDBObjectStoreParameters;
  indexes?: ObjectIndexInterface[];
}

export interface ObjectIndexInterface {
  name: string;
  keyPath: string;
  params?: IDBIndexParameters;
}
