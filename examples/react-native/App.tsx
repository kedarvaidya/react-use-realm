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
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { RealmProvider } from 'react-use-realm';

import { realm, seedDatabase } from './database';

import TodosList from './TodosList';
import TodoForm from './TodoForm';

seedDatabase();

const App = () => {
  return (
    <RealmProvider initialRealm={realm}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.body}>
          <TodosList />
          <TodoForm />
        </View>
      </SafeAreaView>
    </RealmProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
});

export default App;
