import React from 'react';
import { RealmContext, IRealmContext } from './RealmContext';

export interface IRealmProviderProps extends React.PropsWithChildren<{}> {
    initialRealm?: Realm,
}

export function RealmProvider(props: IRealmProviderProps) {
    const [realm, setRealm] = React.useState<Realm | undefined>(props.initialRealm);

    const providerValue: IRealmContext = { realm, setRealm };

    return (<RealmContext.Provider value={providerValue}>
        {props.children}
    </RealmContext.Provider>);
}