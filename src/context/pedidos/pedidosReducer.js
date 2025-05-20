import {
  SELECCIONAR_RESTAURANTE,
  SELECCIONAR_PRODUCTO,
  SELECCIONAR_CONDUCTOR,
  SELECCIONAR_PROMO,
  SELECCIONAR_NEGOCIO,
  OBTENER_CLIENTE,
  OBTENER_RESTAURANTE,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case SELECCIONAR_RESTAURANTE:
      return {
        ...state,
        restauranteseleccionado: action.payload,
      };

    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        platoseleccionado: action.payload,
      };

    case SELECCIONAR_CONDUCTOR:
      return {
        ...state,
        conductorseleccionado: action.payload,
      };

    case SELECCIONAR_PROMO:
      return {
        ...state,
        promoseleccionada: action.payload,
      };

    case SELECCIONAR_NEGOCIO:
      return {
        ...state,
        negocioseleccionado: action.payload,
      };

    case OBTENER_CLIENTE:
      return {
        ...state,
        clienteinfo: action.payload,
      };

    case OBTENER_RESTAURANTE:
      return {
        ...state,
        restauranteinfo: action.payload,
      };

    default:
      return state;
  }
};
