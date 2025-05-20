import React, { useReducer } from "react";

import PedidoReducer from "./pedidosReducer";
import PedidoContext from "./pedidosContext";

// Mover a firebaseState
import firebase from "../../firebase"; // index

import {
  SELECCIONAR_RESTAURANTE,
  SELECCIONAR_PRODUCTO,
  SELECCIONAR_CONDUCTOR,
  SELECCIONAR_PROMO,
  SELECCIONAR_NEGOCIO,
  OBTENER_CLIENTE,
  OBTENER_RESTAURANTE,
} from "../types";

const PedidoState = (props) => {
  const initialState = {
    platoseleccionado: null, // []
    restauranteseleccionado: null,
    conductorseleccionado: null,
    promoseleccionada: null,
    negocioseleccionado: null,
    clienteinfo: null,
    restauranteinfo: null,
    origendestinoinfo: [],
  };

  //useReducer con dispatch para ejecutar las funciones
  const [state, dispatch] = useReducer(PedidoReducer, initialState);

  const seleccionarRestaurante = (restaurante) => {
    console.log(restaurante);
    dispatch({
      type: SELECCIONAR_RESTAURANTE,
      payload: restaurante,
    });
  };

  const seleccionarPlato = (plato) => {
    console.log(plato);
    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: plato,
    });
  };

  const seleccionarConductor = (conductor) => {
    console.log(conductor);
    dispatch({
      type: SELECCIONAR_CONDUCTOR,
      payload: conductor,
    });
  };

  const seleccionarPromo = (promo) => {
    console.log(promo);
    dispatch({
      type: SELECCIONAR_PROMO,
      payload: promo,
    });
  };

  const seleccionarNegocio = (negocio) => {
    console.log(negocio);
    dispatch({
      type: SELECCIONAR_NEGOCIO,
      payload: negocio,
    });
  };

  // Mover a firebaseState
  const obtenerClienteInfo = (ordenclienteid) => {
    // console.log(ordenclienteid)
    firebase.db
      .collection("clientes")
      .doc(ordenclienteid)
      .onSnapshot(function (doc) {
        const clienteInfo = {
          ...doc.data(),
        };

        // console.log(clienteInfo.coordinates.latitude);
        // console.log(clienteInfo.coordinates.longitude);

        dispatch({
          type: OBTENER_CLIENTE,
          payload: clienteInfo,
        });
      });
  };

  // Mover a firebaseState
  const obtenerRestauranteInfo = (ordenrestauranteid) => {
    // console.log(ordenrestauranteid);
    firebase.db
      .collection("restaurantes")
      .doc(ordenrestauranteid)
      .onSnapshot(function (doc) {
        const restauranteInfo = {
          ...doc.data(),
        };

        // console.log(restauranteInfo.coordinates.latitude);
        // console.log(restauranteInfo.coordinates.longitude);

        dispatch({
          type: OBTENER_RESTAURANTE,
          payload: restauranteInfo,
        });
      });
  };

  return (
    <PedidoContext.Provider
      value={{
        restauranteseleccionado: state.restauranteseleccionado,
        platoseleccionado: state.platoseleccionado,
        conductorseleccionado: state.conductorseleccionado,
        promoseleccionada: state.promoseleccionada,
        negocioseleccionado: state.negocioseleccionado,
        clienteinfo: state.clienteinfo, // Principalmente para extraer las coordenadas
        restauranteinfo: state.restauranteinfo, // Principalmente para extraer las coordenadas
        seleccionarRestaurante,
        seleccionarPlato,
        seleccionarConductor,
        seleccionarPromo,
        seleccionarNegocio,
        obtenerClienteInfo,
        obtenerRestauranteInfo,
      }}
    >
      {props.children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;
