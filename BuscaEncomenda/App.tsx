import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, Pressable, Alert, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';

import Feather from "react-native-vector-icons/Feather";

import api from './src/services/api'


import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Jost_100Thin,
  Jost_200ExtraLight,
  Jost_300Light,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
  Jost_700Bold,
  Jost_800ExtraBold,
  Jost_900Black,
} from '@expo-google-fonts/jost';
import { useEffect } from 'react';

export default function App() {

  let [fontsLoaded] = useFonts({
    Jost_100Thin,
    Jost_200ExtraLight,
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
    Jost_700Bold,
    Jost_800ExtraBold,
    Jost_900Black,
  });

  const [codigoRastreio, setCodigoRastreio] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [codigoEncomenda, setCodigoEncomenda] = useState<string>();
  const [eventosEncomenda, setEventosEncomenda] = useState([]);
  const [erro, setErro] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string>("")

  const busca = () => {
    setModalVisible(true);
    async function fetchApi() {

      const resposta = await api.get(`v1/sro-rastro/${codigoRastreio}`);

      setMensagem(resposta.data.objetos[0].mensagem)

      const getEventos = resposta.data.objetos[0].eventos;

      setCodigoEncomenda(resposta.data.objetos[0].codObjeto);

      setEventosEncomenda(getEventos);

    }
    fetchApi();
  }

  const validar = () => {

    const regexCodigo = /[A-Z]{2}[0-9]{9}[B]{1}[R]{1}/gm

    if (regexCodigo.test(codigoRastreio)) {
      setErro(false)
      busca();
    } else {
      setErro(true)
      return
    }
  }

  const formataCodigo = (valor: string) => {
    let formata = valor.replace(/\s/g, '').replace(/[a-z]/gm, '')
    setCodigoRastreio(formata)
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>

        <View style={styles.buscar} >
          <Text style={styles.textoBtn} >Código da encomenda:</Text>
          <TextInput autoCapitalize='characters' value={codigoRastreio} onChangeText={((valor) => { formataCodigo(valor) })} style={styles.entrada}></TextInput>
          <Text style={[styles.textoErro, { opacity: erro ? 1 : 0 }]} >Digite um código válido:</Text>
          <TouchableOpacity style={styles.btnBuscar} onPress={() => validar()} >
            <Text style={styles.textoBtn} >Buscar</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.corpoModal} >
            <View>
              <Text style={styles.textoResultado} >Objeto: {codigoEncomenda} </Text>
              <Text style={styles.textoResultado} >{mensagem} </Text>
              <FlatList
                data={eventosEncomenda}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.eventosView} >
                    <View style={styles.boxImage} >

                      <View style={{ flex: 1, flexDirection: "column", alignItems: "center" }} >
                        <Text style={{ width: 2, height: 100, backgroundColor: '#fbc531', alignSelf: "center", margin: 5 }} ></Text>
                        <Image style={styles.iconeEvento} source={{ uri: 'https://proxyapp.correios.com.br' + item.urlIcone }} />
                      </View>
                    </View>
                    <View style={styles.boxText} >
                      <Text style={styles.textoEvento} >{item.descricao}</Text>
                      <Text style={styles.textoEvento} >{item.unidade.endereco.cidade}</Text>
                      <Text style={styles.textoEvento} >{item.dtHrCriado}</Text>
                    </View>

                  </View>
                )}
              />
              <Feather style={styles.iconeFechar} onPress={() => setModalVisible(!modalVisible)} name="x" size={25} color="#000" />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buscar: {
    marginTop: 50,
    padding: 30,
  },
  entrada: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 10,
    borderRadius: 3,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    fontFamily: "Jost_300Light",
  },
  corpoModal: {
    backgroundColor: "#fff",
    margin: 30,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative"
  },
  iconeFechar: {
    position: "absolute",
    top: -20,
    right: -20,
  },
  btnBuscar: {
    padding: 10,
    backgroundColor: "#fbc531",
    alignItems: "center",
    borderRadius: 3
  },
  textoBtn: {
    fontFamily: "Jost_400Regular",
    fontSize: 16.5
  },
  textoErro: {
    marginTop: 3,
    marginBottom: 3,
    fontFamily: "Jost_400Regular",
    fontSize: 14,
    color: 'red',
  },
  textoResultado: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 15
  },
  eventosView: {
    marginTop: 10,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  etapas: {
    width: 2,
    height: 50,
    backgroundColor: "#fbc531",
  },
  boxImage: {
    flex: 1,
  },
  boxText: {
    flex: 2,
  },
  iconeEvento: {
    width: 50,
    height: 50,
    resizeMode: 'cover'
  },
  textoEvento: {
    fontFamily: "Jost_400Regular",
    fontSize: 11,
  },
});
