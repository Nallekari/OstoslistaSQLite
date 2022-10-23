import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { Header, Icon, Input, Button, ListItem   } from'react-native-elements';

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);

  const db = SQLite.openDatabase('coursedb.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists tuote (id integer primary key not null, product text, amount text);');
    }, null, updateList); 
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into tuote (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from tuote;', [], (_, { rows }) =>
        setProducts(rows._array)
      ); 
    });
  }
  
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from tuote where id = ?;`, [id]);
      }, null, updateList
    )    
  }


  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
      />
      <Input   placeholder='PRODUCT' label='Product'  onChangeText={product => setProduct(product)} value={product} />
      <Input   placeholder='AMOUNT' label='Amount'  onChangeText={amount => setAmount(amount)} value={amount} />
      <Button raised icon={{name: 'save', color: 'white'}} onPress={saveItem} title="SAVE" /> 
      <FlatList 
        style={{width: '100%'}}
        data={products} 
        keyExtractor={item => item.id.toString()} 
        renderItem={({ item }) =>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.product}</ListItem.Title>
              <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
            </ListItem.Content>
            <Button  type='clear' icon={{ name: 'delete', color: 'red', backgroundColor:'white'}} onPress={() => deleteItem(item.id)} title="" /> 
          </ListItem>
        }
      />      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  typebox: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  },
  listcontainer: {
    flexDirection: 'row',
    alignItems: 'center'
   },
  wordBold: {
    fontWeight: 'bold',
    color: 'blue'
 },
});
