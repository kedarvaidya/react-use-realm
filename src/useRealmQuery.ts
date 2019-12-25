import * as React from "react";
import useForceUpdate from "use-force-update";
import { RealmContext } from "./RealmContext";

export interface IUseRealmQueryParams {
  type: string;
  filter?: string;
  variables?: any[];
  sort?: Realm.SortDescriptor[];
}

export function useRealmQuery<T>({
  type,
  filter,
  variables,
  sort
}: IUseRealmQueryParams): Realm.Collection<T> | undefined {
  const { realm } = React.useContext(RealmContext);

  const forceUpdate = useForceUpdate();

  const query = React.useMemo(() => {
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
      return query;
    }
  }, [realm, type, filter, variables, sort]);

  React.useEffect(() => {
    function handleChange(
      _collection: Realm.Collection<T>,
      changes: Realm.CollectionChangeSet
    ) {
      const { insertions, modifications, deletions } = changes;
      if (insertions.length + modifications.length + deletions.length > 0) {
        forceUpdate();
      }
    }

    if (query) {
      query.addListener(handleChange);
      return () => query.removeListener(handleChange);
    }
  }, [query, forceUpdate]);

  return query;
}
