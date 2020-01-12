type Filter = 'all' | 'done' | 'not-done';

export interface IWorkspace {
  id: string;
  title: string;
  todos: Realm.Results<ITodo>
}

export interface ITodo {
  id: string;
  title: string;
  doneAt?: Date;
  workspace: IWorkspace
}
