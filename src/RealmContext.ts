import React from 'react';
import Realm from 'realm';

export interface IRealmContext {
  realm?: Realm,
  setRealm: (realm: Realm | undefined) => void
};

export const RealmContext = React.createContext<IRealmContext>({
  realm: undefined,
  setRealm: () => {}
});