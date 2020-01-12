import * as React from "react";
import { RealmContext } from "./RealmContext";
import useRealmResultsListener from "./useRealmResultsListener";

export interface IUseRealmQueryParams<T> {
  source: string | Realm.Results<T>;
  filter?: string;
  variables?: any[];
  sort?: Realm.SortDescriptor[];
}

export function useRealmQuery<T>({
  source,
  filter,
  variables,
  sort
}: IUseRealmQueryParams<T>): Realm.Collection<T> | undefined {
  const { realm } = React.useContext(RealmContext);

  const query = React.useMemo(() => {
    if (realm) {
      let query = typeof source === 'string' ? realm.objects<T>(source) : source;
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
  }, [realm, source, filter, variables, sort]);

  useRealmResultsListener<T>(query);

  return query;
}
