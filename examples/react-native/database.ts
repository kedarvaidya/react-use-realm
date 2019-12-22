import Realm from 'realm';
import cuid from 'cuid';

export interface ITodo {
  id: string,
  title: string,
  doneAt?: Date
}

export const TodoSchema: Realm.ObjectSchema = {
  name: 'Todo',
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: 'string',
    doneAt: { type: 'date', optional: true }
  }
};

export const schemas = [TodoSchema];

export const realm = new Realm({ schema: schemas });

export function seedDatabase() {
  if (realm.empty) {
    realm.write(() => {
      [1, 2, 3].forEach((n) => {
        const todo = {
          id: cuid(),
          title: `Task ${n}`,
          doneAt: undefined
        };

        realm.create(TodoSchema.name, todo);
      });
    });
  }
}