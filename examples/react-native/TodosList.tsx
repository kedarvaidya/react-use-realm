import React from 'react';
import { FlatList, View, Text, Switch, Picker, Platform } from 'react-native';
import { useRealmQuery, RealmContext } from 'react-use-realm';

import { ITodo, TodoSchema } from './database';

type Filter = 'all' | 'done' | 'not-done';

const filterDisplayNames: Record<Filter, string> = {
    'all': 'All Tasks',
    'done': 'Completed Tasks',
    'not-done': 'Incomplete Tasks'
};

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

export default function TodosList() {
    const [filter, setFilter] = React.useState<Filter>('all');

    const todos = useRealmQuery<ITodo>({
        type: TodoSchema.name,
        filter: filterQueries[filter]
    });

    return (
        <>
            {Platform.OS === 'android' && <Picker mode="dropdown" selectedValue={filter} prompt={filterDisplayNames[filter]} style={{ height: 40, width: '100%', margin: 16 }} onValueChange={value => setFilter(value)}>
                {Object.keys(filterDisplayNames).map(filter => <Picker.Item key={filter} value={filter} label={filterDisplayNames[filter as Filter]} />)}
            </Picker>}
            {todos ? <FlatList data={todos} renderItem={({ item }) => <TodoItem todo={item} />} /> : <Text>No tasks present</Text>}
        </>
    )
}