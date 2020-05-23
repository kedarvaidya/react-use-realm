import React from 'react';
import Realm from 'realm';
import { renderHook, act } from '@testing-library/react-hooks';
import { useRealmQuery } from '../src/useRealmQuery';
import { RealmProvider } from '../src/RealmProvider';

import { PersonSchema, TaskSchema, Person, deleteTestDatabase, createTestDatabase } from './helpers/database';

describe('useRealmQuery', () => {
    let defaultRealm: Realm | undefined;
    let defaultWrapper: React.FC;

    const cleanupDatabase = () => {
        if (defaultRealm) {
            deleteTestDatabase(defaultRealm!);
            defaultRealm = undefined;
        }
    };

    beforeEach(() => {
        cleanupDatabase();

        defaultRealm = createTestDatabase();
        defaultWrapper = ({ children }) => <RealmProvider initialRealm={defaultRealm}>{children}</RealmProvider>;
    });

    afterEach(cleanupDatabase);

    afterAll(cleanupDatabase);

    test('returns undefined when realm is not defined', () => {
        const wrapper: React.FC = ({ children }) => <RealmProvider initialRealm={undefined}>{children}</RealmProvider>;
        const { result } = renderHook(() => useRealmQuery({ source: 'Person' }), { wrapper });
        expect(result.current).toBe(undefined);
    });

    describe('when source is collection name', () => {
        test('returns all records', () => {
            const { result } = renderHook(() => useRealmQuery({ source: 'Person' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(2);
        });

        test('re-renders when record is added', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(2);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.create(PersonSchema.name, { id: 'new', name: 'New Person', age: 40 });
                });
            });

            await waitForNextUpdate();
            expect(result.current!.length).toBe(3);
        });

        test('re-renders when record is updated', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(2);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.create(PersonSchema.name, { id: 'p1', name: 'Person 1 Updated' }, true);
                });
            });

            await waitForNextUpdate();
            expect(result.current!.length).toBe(2);
        });

        test('re-renders when record is deleted', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(2);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.delete(defaultRealm!.objectForPrimaryKey(PersonSchema.name, 'p1'));
                });
            });

            await waitForNextUpdate();
            expect(result.current!.length).toBe(1);
        });

        test('re-renders when no records are changed', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(2);

            act(() => {
                defaultRealm!.write(() => {
                });
            });

            try {
                await waitForNextUpdate({ timeout: 500 });
            } catch (err) {
                expect(err.timeout).toBeTruthy();
            }
            expect(result.current!.length).toBe(2);
        });

        test('returns filtered records when filters has no variables', () => {
            const { result } = renderHook(() => useRealmQuery({ source: 'Person', filter: 'age > 30' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);
        });

        test('returns filtered records when filter has variables', () => {
            const { result } = renderHook(() => useRealmQuery({ source: 'Person', filter: 'age > $0', variables: [30] }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);
        });

        test('returns updated filtered records when filter string is changed', () => {
            let filter = 'age > $0';
            const { result, rerender } = renderHook(() => useRealmQuery<Person>({ source: 'Person', filter, variables: [30] }), { wrapper: defaultWrapper });
            expect(Array.from(result.current!)[0].name).toBe('Person 2');

            filter = 'age < $0';
            rerender();
            expect(Array.from(result.current!)[0].name).toBe('Person 1');
        });

        test('returns updated filtered records when filter variables are changed', () => {
            let variables = [30];
            const { result, rerender } = renderHook(() => useRealmQuery<Person>({ source: 'Person', filter: 'age > $0', variables }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);

            variables[0] = 40
            rerender();
            expect(result.current!.length).toBe(0);
        });

        test('re-renders when record matching filter is added', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person', filter: 'age > 30' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.create(PersonSchema.name, { id: 'p3', name: 'Person 3', age: 40 }, true);
                });
            });

            await waitForNextUpdate();
            expect(result.current!.length).toBe(2);
        });

        test('does not re-render when record not matching filter is added', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person', filter: 'age > 30' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.create(PersonSchema.name, { id: 'p3', name: 'Person 3', age: 20 }, true);
                });
            });

            try {
                await waitForNextUpdate({ timeout: 500 });
            } catch (err) {
                expect(err.timeout).toBeTruthy();
            }
            expect(result.current!.length).toBe(1);
        });

        test('re-renders when record matching filter is updated', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery<Person>({ source: 'Person', filter: 'age > 30' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.create(PersonSchema.name, { id: 'p2', name: 'Person 2 Updated' }, true);
                });
            });

            await waitForNextUpdate();
            expect(result.current!.length).toBe(1);
            // expect(Array.from(result.current!)[0].name).toBe('Person 2 Updated');
        });

        test('does not re-render when record not matching is updated', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person', filter: 'age > 30' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.create(PersonSchema.name, { id: 'p1', name: 'Person 1 Updated' }, true);
                });
            });

            try {
                await waitForNextUpdate({ timeout: 500 });
            } catch (err) {
                expect(err.timeout).toBeTruthy();
            }
            expect(result.current!.length).toBe(1);
        });

        test('re-renders when record matching filter is deleted', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person', filter: 'age > 30' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.delete(defaultRealm!.objectForPrimaryKey(PersonSchema.name, 'p2'));
                });
            });

            await waitForNextUpdate();
            expect(result.current!.length).toBe(0);
        });

        test('does not re-render when record not matching filter is deleted', async () => {
            const { result, waitForNextUpdate } = renderHook(() => useRealmQuery({ source: 'Person', filter: 'age > 30' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(1);

            act(() => {
                defaultRealm!.write(() => {
                    defaultRealm!.delete(defaultRealm!.objectForPrimaryKey(PersonSchema.name, 'p1'));
                });
            });

            try {
                await waitForNextUpdate({ timeout: 500 });
            } catch (err) {
                expect(err.timeout).toBeTruthy();
            }

            expect(result.current!.length).toBe(1);
        });

        test('returns sorted records on single field', () => {
            const { result } = renderHook(() => useRealmQuery<Person>({ source: 'Person', sort: [['name', true]] }), { wrapper: defaultWrapper });
            expect(result.current!.map(p => p.name)).toEqual(['Person 2', 'Person 1']);
        });

        test('returns sorted records on multiple fields', () => {
            defaultRealm!.write(() => {
                defaultRealm!.create(PersonSchema.name, { id: 'p3', name: 'Person 3', age: 35 }, true);
            });
            const { result } = renderHook(() => useRealmQuery<Person>({ source: 'Person', sort: [['age', true], ['name', true]] }), { wrapper: defaultWrapper });
            expect(result.current!.map(p => p.name)).toEqual(['Person 3', 'Person 2', 'Person 1']);
        });
    });

    describe('when source is existing results', () => {
        test('returns all records', () => {
            const person1 = defaultRealm!.objectForPrimaryKey<Person>(PersonSchema.name, 'p1')!
            const { result } = renderHook(() => useRealmQuery({ source: person1.tasks, sourceKey: 'p1_tasks' }), { wrapper: defaultWrapper });
            expect(result.current!.length).toBe(4);
        });

        test('throws warning when sourceKey is missing', () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
            try {
                const person1 = defaultRealm!.objectForPrimaryKey<Person>(PersonSchema.name, 'p1')!
                renderHook(() => useRealmQuery({ source: person1.tasks }), { wrapper: defaultWrapper });
                expect(warnSpy).toHaveBeenCalledTimes(1);
            } finally {
                if (warnSpy) {
                    warnSpy.mockRestore();
                }
            }
        });
    });
});