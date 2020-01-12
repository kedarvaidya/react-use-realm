import Realm from 'realm';
import cuid from 'cuid';

export const WorkspaceSchema: Realm.ObjectSchema = {
  name: 'Workspace',
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: 'string',
    todos: { type: 'linkingObjects', objectType: 'Todo', property: 'workspace' }
  }
}

export const TodoSchema: Realm.ObjectSchema = {
  name: 'Todo',
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: 'string',
    doneAt: { type: 'date', optional: true },
    workspace: 'Workspace'
  }
};

export const schemas = [WorkspaceSchema, TodoSchema];

export const realm = new Realm({ schema: schemas, deleteRealmIfMigrationNeeded: true });

export function seedDatabase() {
  if (realm.empty) {
    realm.write(() => {
      ['personal', 'work'].forEach(workspaceId => {
        const workspaceTitle = workspaceId[0].toUpperCase() + workspaceId.substr(1);
        let workspace = {
          id: workspaceId,
          title: workspaceTitle
        };
        workspace = realm.create(WorkspaceSchema.name, workspace);

        [1, 2, 3].forEach((n) => {
          const todo = {
            id: cuid(),
            title: `${workspaceTitle} Task ${n}`,
            doneAt: undefined,
            workspace: workspace
          };
  
          realm.create(TodoSchema.name, todo);
        });
      });
    });
  }
}