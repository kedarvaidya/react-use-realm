/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';

import { RealmProvider } from 'react-use-realm';

import { realm, seedDatabase } from './database';

import Screen from './Screen';

seedDatabase();

const App = () => {
  return (
    <RealmProvider initialRealm={realm}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Screen />
      </SafeAreaView>
    </RealmProvider>
  );
};

export default App;
