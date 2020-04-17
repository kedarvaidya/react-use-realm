import * as React from "react";
import { RealmContext } from "./RealmContext";
import useRealmResultsListener from "./useRealmResultsListener";
import { flattenArrayOfArrays } from "./utils";

export interface IUseRealmQueryParams<T> {
  source: string | Realm.Results<T>;
  sourceKey?: string,
  filter?: string;
  variables?: any[];
  sort?: Realm.SortDescriptor[];
}

export function useRealmQuery<T>({
  source,
  sourceKey,
  filter,
  variables,
  sort
}: IUseRealmQueryParams<T>): Realm.Collection<T> | undefined {
  const { realm } = React.useContext(RealmContext);

  if (typeof sourceKey === 'undefined' && typeof source !== 'string') {
    console.warn(`Warning: 'sourceKey' is required when realm results are passed as 'source'. 'sourceKey' is used by 'react-use-realm' to prevent re-renders.`);
  }

  const finalSourceKey = typeof sourceKey !== 'undefined' ? sourceKey : source;

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
  }, [realm, finalSourceKey , filter, ...(variables ? variables : []), ...(sort ? flattenArrayOfArrays(sort) : [])]);

  useRealmResultsListener<T>(query);

  return query;
}
