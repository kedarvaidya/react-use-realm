import React from 'react';
import { Platform, Picker, StyleSheet, View, Text } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useRealmQuery } from 'react-use-realm';

import { Filter, IWorkspace } from './types';
import { WorkspaceSchema } from './database';
import TodosList from './TodosList';
import TodoForm from './TodoForm';

const filterDisplayNames: Record<Filter, string> = {
    'all': 'All Tasks',
    'done': 'Completed Tasks',
    'not-done': 'Incomplete Tasks'
};

const Workspace = ({ workspace, filter }: { workspace: IWorkspace, filter: Filter }) => (<View style={styles.workspace}>
    <Text style={styles.workspaceHeader}>{workspace.title}</Text>
    <TodosList workspace={workspace} filter={filter} />
    <TodoForm workspace={workspace} />
</View>);

export default function Screen() {
    const [filter, setFilter] = React.useState<Filter>('all');

    const workspaces = useRealmQuery<IWorkspace>({
        source: WorkspaceSchema.name,
        sort: [['id', /* descending */ false]]
    });

    return <View style={styles.body}>
        {Platform.OS === 'android' && <Picker mode="dropdown" selectedValue={filter} prompt={filterDisplayNames[filter]} style={{ height: 40, width: '100%', margin: 16 }} onValueChange={value => setFilter(value)}>
            {Object.keys(filterDisplayNames).map(filter => <Picker.Item key={filter} value={filter} label={filterDisplayNames[filter as Filter]} />)}
        </Picker>}
        {workspaces ?
            workspaces.map(w => <Workspace key={w.id} workspace={w} filter={filter} />) : <Text>No workspaces added yet</Text>}
    </View>
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.white,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    workspace: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    workspaceHeader: {
        marginHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
});