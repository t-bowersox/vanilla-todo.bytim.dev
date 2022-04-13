export interface DatabaseServiceInterface {
  open(): Promise<boolean>;

  close(): Promise<boolean>;

  create<T>(record: T, collection: string): Promise<string | number>;

  read<T>(collection: string, query?: string | number): Promise<Array<T>>;

  update<T>(
    recordId: string | number,
    data: T,
    collection: string
  ): Promise<boolean>;

  delete(recordId: string | number, collection: string): Promise<boolean>;
}
