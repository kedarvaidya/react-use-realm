import React from 'react';
import { FlatList, View, Text, Switch } from 'react-native';
import { useRealmQuery, RealmContext } from 'react-use-realm';

import { Filter, ITodo, IWorkspace } from 'types';

const filterQueries: Record<Filter, string | undefined> = {
    'all': undefined,
    'done': 'doneAt != null',
    'not-done': 'doneAt = null'
};

function TodoItem({ todo }: { todo: ITodo }) {
    const { realm } = React.useContext(RealmContext);

    function toggleTodo() {
        if (realm) {
            realm.write(() => {
                todo.doneAt = todo.doneAt ? undefined : new Date();
            });
        }
    }

    return <View style={{ flexDirection: 'row', alignItems: 'center', margin: 16 }}>
        <Switch value={!!todo.doneAt} onValueChange={() => toggleTodo()} />
        <Text style={{ flex: 1, marginLeft: 8 }}>{todo.title}</Text>
    </View>
}

export default function TodosList({ workspace, filter }: { workspace: IWorkspace, filter: Filter }) {
    const todos = useRealmQuery<ITodo>({
        source: workspace.todos,
        sourceType: 'WorkspaceTodos',
        filter: filterQueries[filter]
    });

    return (
        <>
            {<FlatList data={todos as Realm.Collection<ITodo>} renderItem={({ item }) => <TodoItem todo={item} />} />}
        </>
    )
}