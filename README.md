# React Use Realm

[![npm version](https://badge.fury.io/js/react-use-realm.svg)](https://badge.fury.io/js/react-use-realm)

Use Realm with [React Hooks](https://reactjs.org/docs/hooks-intro.html)

- Provides a [React Context](https://reactjs.org/docs/context.html) for child components to read from and write to the database.
- Provides a [React Hooks](https://reactjs.org/docs/hooks-intro.html) to query the database. Re-renders the component when data changes

**Please note:** This package uses Realm JS, and it, therefore, has the same limitation that it needs access to the device file system and therefore cannot run a "regular" web-browser. This package is meant to be used in an environment like Node.js, React Native or Electron where the JavaScript thread has access to the file system.

## Installation

Using _NPM_

```shell
npm install --save react-use-realm
```

Using _Yarn_

```shell
yarn add react-use-realm
```

**Note:** This package depends on Realm JS version 3.0 or above and React at version 16.8 or above, but to allow maximum flexibility these are not direct dependencies but rather peer dependencies that need to be installed for this package to function correctly.

## Usage

### Initializing

First, wrap your root component with RealmProvider. If you have an instance of Realm, you can pass it to the RealmProvider in the initialRealm prop.

#### Example

```javascript
import { RealmProvider } from "react-use-realm";

import { realm } from "./my-realm";

const App = () => {
  <RealmProivider initialRealm={realm}>
    // ...Existing component tree
  </RealmProvider>;
};
```

If you don't have a Realm instance at the time of the creation of RealmProvider (e.g. Realm is created after user signs up), then you need to set the realm instance from a child component.

#### Example

```javascript
import React from "react";
import { RealmContext } from "react-use-realm";

import { SchemaList } from "./my-realm-schema";

const MySignupForm = () => {
  const { setRealm } = React.useContext(RealmContext);

  const signup = async () => {
    // Call the sign up api
    // Create and set realm
    const realm = new Realm({ schema: SchemaList });
    setRealm(realm);
    // Other code (eg. Navigate to another screen)
  };

  return (
    <MyForm>
      // ...Form inputs
      <MyButton onPress={signup}>Sign up</MyButton>
    </MyForm>
  );
};
```

### Querying

You can query the realm database using useRealmQuery react hook.

#### Example

```javascript
import React from "react";
import { useRealmQuery } from "react-use-realm";

import { TodoSchema } from "./my-realm-schema";
import MyTodoItem from "./MyTodoItem";

const MyTodoList = () => {
  const todos = useRealmQuery({
    source: TodoSchema.name
  });

  return (
    <>
      {todos
        ? todos.map(todo => <MyTodoItem key={todo.id} todo={todo} />)
        : "No todos present"}
    </>
  );
};
```

#### Filtering Example

```javascript
const todos = useRealmQuery({
  source: TodoSchema.name,
  filter: 'done != true'
});
```

#### Filtering Example with Variables

```javascript
const todos = useRealmQuery({
  source: TodoSchema.name,
  filter: 'text CONTAINS $0',
  variables: mySearchString
});
```

#### Sorting Example

```javascript
const todos = useRealmQuery({
  source: TodoSchema.name,
  sort: ['createdAt']
});
```

#### Sorting Descending Example

```javascript
const todos = useRealmQuery({
  source: TodoSchema.name,
  sort: [['createdAt', /* descending */ true]]
});
```

#### Queying Linked Objects Example

```javascript
const workspaceTodos = useRealmQuery({
  source: workspace.todos,
  filter: 'text CONTAINS $0',
});
```

## License

[MIT](https://github.com/kedarvaidya/react-use-realm/blob/master/LICENSE)
