/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from 'react-native';


import Icon from 'react-native-vector-icons/SimpleLineIcons';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {


  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      consumo: "",
      tensao: "",
      tarifa: ""
    })
  }


  roundMethod(value) {
    let rounded = Math.round(value * 100) / 100
    return rounded;
  }

  getConsumo() {
    let self = this;
    let rota = 'http://192.168.12.134:8080/WebServiceCorrente/webresources/corrente/valor';
    fetch(rota, {
      method: 'GET',
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json',
      }
    })
    .then((response) =>{
      return response.json();
    })
    .then((responseJSON) => {
      console.log(responseJSON)
      let consumo = responseJSON.valor;
      console.log(consumo)
      return self.roundMethod(consumo);
    })
    .then((correnteTotal) => {
      self.setState({
        consumo: correnteTotal
      })
    })
    .catch((Ex) => {
      console.log(Ex) 
    })

  }

  getConsumoInfo() {
    if(this.state.consumo === "") return null;

    return (
      <View>
        <Text style= {styles.correnteConsumidaTexto}>
          Corrente consumida 
        </Text>
        <Text style={{color: '#F2911B'}}> 
        {this.state.consumo} Amperes
        </Text>
      </View>
    )
  }

  getTensaoInfo() {
    if(this.state.tensao === "") return null;
    return(
      <View>
        <Text style= {styles.correnteConsumidaTexto}>
          Tensão do aparelho 
        </Text>
        <Text style={{color: '#F2911B'}}> 
          {this.state.tensao} V
        </Text>
    </View>
    )
  } 

  setTensao(valor) {
    this.setState({
      tensao: valor
    })

  }

  /* CALCULAR A QUANTIDADE DE ENERGIA
   -> E(KWH) = (consumo * tensao))/1000
   -> R$ = R$ * E
  */
  calcValorTotal() {
    let tensao = this.state.tensao;
    let consumo = this.state.consumo;
    let tarifa = this.state.tarifa;
    let kwath = (tensao * consumo)/(1000*60); // /100; (para testes)
    return (kwath * tarifa);
  }
  getValorReal() {
    console.log(this.state.tarifa)
    if(this.state.tarifa === "") return null;
    return(
      <View>
        <Text style= {styles.correnteConsumidaTexto}>
         Valor total (R$) 
        </Text>
        <Text style={{color: '#F2911B'}}> 
          R$ {this.calcValorTotal()}
        </Text>
    </View>

    )
  }

  getCardInfo() {
    if(this.state.tensao ===  "" && this.state.consumo === "") return null;
    return (
      <View>
        <View style={{marginVertical: 8}}>
          <TextInput
            ref={((tarifa) => {
              this.tarifa = tarifa
            })}
            value={this.state.tarifa}
            onChangeText={((text) => {
              this.setState({
                tarifa: text    
              })
            })}
            selectionColorr={"#FFF"}
            autoGrow={false}
            underlineColorAndroid={"#FFFFFF"}
            placeholderTextColor={"#FFFFFF"}
            keyboardType={'numeric'}
            returnKeyType={'done'}
            placeholder={"Valor do KWH (R$)"}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#0BAC30",
              borderRadius: 2,
              elevation: 2,
              padding: 6,
              justifyContent: 'center'
            }}
            onPress={
              this.getValorReal.bind(this)
            }
            >
            <Text style={{
              color: "#FFF",
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              Consultar (R$)
            </Text>
          </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        {this.getConsumoInfo()}
        {this.getTensaoInfo()}
        {this.getValorReal()}
      </View>
    </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Para obter a quantidade de corrente consumida, pressione o botão abaixo
        </Text>
        
        <TouchableOpacity
          onPress={this.getConsumo.bind(this)}
          style={styles.botaoConsumo}
        >
          <Text style = {styles.textBotaoConsumo}>
            <Icon name={"energy"} size={30}/>
            Obter consumo (A)
          </Text>
        </TouchableOpacity>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 16
          }}>
          <TouchableOpacity style={{
            marginRight: 8,
            padding: 16,
            borderRadius: 2,
            elevation: 2,
            backgroundColor:"#005ABA"
          }}
          onPress={this.setTensao.bind(this,127)}
          >
            <Text style={{color: "#FFFFFF", fontWeight: 'bold'}}>
              127V
            </Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={{
            marginLeft: 8,
            padding: 16,
            borderRadius: 2,
            elevation: 2,
            backgroundColor:"#005ABA"
          }}
            onPress={this.setTensao.bind(this,227)}
          >
            <Text style={{color: "#FFFFFF", fontWeight: 'bold'}}>
               227V
            </Text>
          </TouchableOpacity>
        </View>
        {this.getCardInfo()}
        <Text style={{color: "#FFF", textAlign: 'left', fontSize: 12}}>
          *Para testes e demonstrações: 1W = 1KW
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F2911B',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#FFFFFF",
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  botaoConsumo: {
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 16,
    borderRadius: 2,
    elevation: 2
  },
  textBotaoConsumo: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 20,
    justifyContent: 'center'
  },
  correnteConsumidaTexto: {
    fontSize: 18,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginVertical: 16,
    elevation: 2,
    borderRadius: 2
  }
});
