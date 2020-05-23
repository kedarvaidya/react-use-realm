import React from 'react';
import Realm from 'realm';
import { renderHook, act } from '@testing-library/react-hooks';
import { RealmContext } from '../src/RealmContext';
import { RealmProvider } from '../src/RealmProvider';
import { deleteTestDatabase, createTestDatabase } from './helpers/database';

describe('RealmProvider', () => {
    let defaultRealm: Realm | undefined;

    const cleanupDatabase = () => {
        if (defaultRealm) {
            deleteTestDatabase(defaultRealm!);
            defaultRealm = undefined;
        }
    };

    beforeEach(() => {
        cleanupDatabase();

        defaultRealm = createTestDatabase();
    });

    afterEach(cleanupDatabase);

    afterAll(cleanupDatabase);

    test('initial realm is undefined by default', () => {
        const wrapper: React.FC = ({ children }) => <RealmProvider>{children}</RealmProvider>;
        const { result } = renderHook(() => React.useContext(RealmContext), { wrapper });
        expect(result.current.realm).toBe(undefined);
    });

    test('sets initial realm', () => {
        const wrapper: React.FC = ({ children }) => <RealmProvider initialRealm={defaultRealm}>{children}</RealmProvider>;
        const { result } = renderHook(() => React.useContext(RealmContext), { wrapper });
        expect(result.current.realm).toBe(defaultRealm);
    });

    test('allows changing realm from consumer', () => {
        const wrapper: React.FC = ({ children }) => <RealmProvider initialRealm={undefined}>{children}</RealmProvider>;
        const { result } = renderHook(() => React.useContext(RealmContext), { wrapper });
        expect(result.current.realm).toBe(undefined);

        act(() => {
            result.current.setRealm(defaultRealm);
        });
        expect(result.current.realm).toBe(defaultRealm);
    });
});