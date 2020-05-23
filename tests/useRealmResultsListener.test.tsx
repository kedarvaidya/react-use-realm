import React from 'react';
import Realm from 'realm';
import { renderHook, act } from '@testing-library/react-hooks';
import useRealmResultsListener from '../src/useRealmResultsListener';
import { RealmProvider } from '../src/RealmProvider';

import { PersonSchema, TaskSchema, Person, deleteTestDatabase, createTestDatabase } from './helpers/database';

describe('useRealmQuery', () => {
    let defaultRealm: Realm | undefined;
    let defaultWrapper: React.FC;
    let defaultQuery: Realm.Results<Person> | undefined;

    const cleanupDatabase = () => {
        if (defaultQuery) {
            defaultQuery.removeAllListeners();
            defaultQuery = undefined;
        }

        if (defaultRealm) {
            deleteTestDatabase(defaultRealm!);
            defaultRealm = undefined;
        }
    };

    beforeEach(() => {
        cleanupDatabase();

        defaultRealm = createTestDatabase();
        defaultWrapper = ({ children }) => <RealmProvider initialRealm={defaultRealm}>{children}</RealmProvider>;
        defaultQuery = defaultRealm.objects<Person>(PersonSchema.name)
            .filtered('age > 30');
    });

    afterEach(cleanupDatabase);

    afterAll(cleanupDatabase);

    test('returns undefined when query is not defined', () => {
        const wrapper: React.FC = ({ children }) => <RealmProvider initialRealm={undefined}>{children}</RealmProvider>;
        const { result } = renderHook(() => useRealmResultsListener(undefined), { wrapper });
        expect(result.current).toBe(undefined);
    });

    test('returns records', () => {
        const wrapper: React.FC = ({ children }) => <RealmProvider initialRealm={defaultRealm}>{children}</RealmProvider>;
        const { result } = renderHook(() => useRealmResultsListener(defaultQuery), { wrapper });
        expect(result.current!.length).toBe(1);
    });

    test('re-renders when record matching query is added', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useRealmResultsListener(defaultQuery), { wrapper: defaultWrapper });
        expect(result.current!.length).toBe(1);

        act(() => {
            defaultRealm!.write(() => {
                defaultRealm!.create(PersonSchema.name, { id: 'p3', name: 'Person 3', age: 40 }, true);
            });
        });

        await waitForNextUpdate();
        expect(result.current!.length).toBe(2);
    });
});