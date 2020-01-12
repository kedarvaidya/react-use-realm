import * as React from "react";
import useForceUpdate from "use-force-update";

export default function useRealmResultsListener<T>(query: Realm.Results<T> | undefined) {
  const forceUpdate = useForceUpdate();

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
