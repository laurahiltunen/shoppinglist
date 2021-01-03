import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import{ Header, Input, Button } from 'react-native-elements';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {
  const [maara, setMaara] = useState('');
  const [tuote, setTuote] = useState('');
  const [ostokset, setOstokset] = useState([]);



  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists ostokset (id integer primary key not null, maara text, tuote text);');
    });
    updateList();    
  }, []);
    
  
  // Tallenna tuote
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into ostokset (maara, tuote) values (?, ?);', [maara, tuote]);    
      }, null, updateList
    )
  }

  // Päivittää ostoslistan
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from ostokset;', [], (_, { rows }) =>
        setOstokset(rows._array)
      ); 
    });
  }

  // Poistaa ostoksen
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from ostokset where id = ?;', [id]);
      }, null, updateList
    )    
  }


  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon:'menu', color: '#fff' }}
        centerComponent={{ text:'OSTOSLISTA', style:{ color: '#fff' } }}
        rightComponent={{ icon:'home', color: '#fff' }}/>

      <Input placeholder='Kirjoita ostos' label='TUOTE' 
        onChangeText={(tuote) => setTuote(tuote)}
        value={tuote}/>
      <Input placeholder='Kuinka paljon?' label='MÄÄRÄ' 
        onChangeText={(maara) => setMaara(maara)}
        value={maara}/>

      <Button raised icon = {{name: 'save', color: "white"}} onPress={saveItem} title="TALLENNA"/>

      <Text style={{marginTop: 30, fontSize: 20}}>Ostokset</Text>
      
      <FlatList
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.tuote}, {item.maara}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}>Ostettu</Text></View>} 
        data={ostokset}  
      /> 
     
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});
