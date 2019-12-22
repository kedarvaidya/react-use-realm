import * as React from 'react';
import useForceUpdate from 'use-force-update';
import { RealmContext } from './RealmContext';

export interface IUseRealmQueryParams {
  type: string;
  filter?: string;
  variables?: any[];
  sort?: Realm.SortDescriptor[];
};

export function useRealmQuery<T>({
  type,
  filter,
  variables,
  sort,
}: IUseRealmQueryParams): Realm.Collection<T> | undefined {
  const { realm } = React.useContext(RealmContext);
  const [results, setResults] = React.useState<Realm.Collection<T> | undefined>(
    undefined,
  );

  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    function handleChange(
      collection: Realm.Collection<T>,
      changes: Realm.CollectionChangeSet,
    ) {
      const {insertions, modifications, deletions} = changes;
      if ((insertions.length + modifications.length + deletions.length) > 0) {
        forceUpdate();
      }
    }

    if (realm) {
      let query = realm.objects<T>(type);
      if (filter) {
        if (variables) {
          query = query.filtered(filter, ...variables);
        } else {
          query = query.filtered(filter);
        }
      }
      if (sort) {
        query = query.sorted(sort);
      }
      query.addListener(handleChange);
      setResults(query);
      return () => query.removeListener(handleChange);
    }
  }, [realm, type, filter, variables, sort, forceUpdate]);

  return results;
}
