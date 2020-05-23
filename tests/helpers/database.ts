import Realm from 'realm';
import cuid from 'cuid';

export const PersonSchema: Realm.ObjectSchema = {
    name: 'Person',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        age: 'int',
        tasks: { type: 'linkingObjects', objectType: 'Task', property: 'person' }
    }
};

export const TaskSchema: Realm.ObjectSchema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
        id: 'string',
        description: 'string',
        done: 'bool',
        person: 'Person'
    }
};

export type Person = { id: string, name: string, age: number, tasks: Realm.Results<Task> };

export type Task = { id: string, description: string, done: boolean, person: Person };

export function createTestDatabase() {
    const databaseName = `test-${cuid()}.realm`;

    const realm = new Realm({
        path: databaseName,
        schema: [PersonSchema, TaskSchema]
    });

    realm.write(() => {
        const person1 = realm!.create(PersonSchema.name, { id: 'p1', name: 'Person 1', age: 25 }, true);
        realm!.create(PersonSchema.name, { id: 'p2', name: 'Person 2', age: 35 }, true);

        realm!.create(TaskSchema.name, { id: 'p1r1', description: 'Person 1 Task 1', done: true, person: person1 });
        realm!.create(TaskSchema.name, { id: 'p1t2', description: 'Person 1 Task 2', done: true, person: person1 });
        realm!.create(TaskSchema.name, { id: 'p1t3', description: 'Person 1 Task 3', done: false, person: person1 });
        realm!.create(TaskSchema.name, { id: 'p1t4', description: 'Person 1 Task 4', done: false, person: person1 });
    });

    return realm;
}

export function deleteTestDatabase(realm: Realm) {
    const path = realm.path;
    if (!realm.isClosed) {
        realm.close();
    }
    if (Realm.exists({ path })) {
        Realm.deleteFile({ path });
    }
}
