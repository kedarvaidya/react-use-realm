import React from 'react';
import { View, TextInput, Button } from 'react-native';
import cuid from 'cuid';
import { RealmContext } from 'react-use-realm';
import { TodoSchema } from './database';
import { IWorkspace } from 'types';

export default function TodoForm({ workspace }: { workspace: IWorkspace }) {
    const [title, setTitle] = React.useState('');

    const { realm } = React.useContext(RealmContext);

    function addTodo() {
        if (realm && title) {
            realm.write(() => {
                const todo = {
                    id: cuid(),
                    title,
                    workspace
                };
                realm.create(TodoSchema.name, todo);
            });
            setTitle('');
        }
    }

    return (
        <View style={{ flexDirection: 'row', margin: 16 }}>
            <TextInput value={title} onChangeText={value => setTitle(value)} style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 8 }} />
            <Button title="Add" onPress={() => addTodo()} />
        </View>
    )
}