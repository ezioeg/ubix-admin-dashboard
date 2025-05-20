import React, { useContext, useEffect, useState } from "react";
import { GeoFirestore } from "geofirestore";

import { FirebaseContext } from "../../firebase";
import PedidoContext from "../../context/pedidos/pedidosContext";

// Para los Modales
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const Orden = ({ orden }) => {
  const [visibleCaptura, setVisibleCaptura] = useState(false);
  const [visibleConductorSeleccion, setVisibleConductorSeleccion] =
    useState(false);
  const [visibleModalEliminar, setVisibleModalEliminar] = useState(false);
  const [nombreConductor, setNombreConductor] = useState("");
  const [celularConductor, setCelularConductor] = useState("");

  // Context de firebase
  const { firebase } = useContext(FirebaseContext);
  // Para extraer las coordenadas del cliente
  const { obtenerClienteInfo, obtenerRestauranteInfo, restauranteinfo } =
    useContext(PedidoContext);

  // Para revisar las localizaciones de los conductores
  const geofirestore = new GeoFirestore(firebase.db);
  const geocollection = geofirestore.collection("conductores");

  useEffect(() => {
    obtenerClienteInfo(orden.clienteId);
    obtenerRestauranteInfo(orden.orden[0].restauranteId);
    // eslint-disable-next-line
  }, [orden.clienteId, orden.orden]);

  // Busca el conductor disponible, con menos cantidad de ordenes pendientes y mas cercano al negocio
  const buscarConductor = async (ordenid) => {
    console.log(ordenid);
    // console.log(orden);
    // console.log(restauranteinfo.coordinates.latitude);
    // console.log(restauranteinfo.coordinates.longitude);
    try {
      const query = geocollection.near({
        center: new firebase.fire.GeoPoint(
          restauranteinfo.coordinates.latitude,
          restauranteinfo.coordinates.longitude
        ),
        radius: 50,
      });

      // Obtiene los conductores disponibles
      query.get().then((querySnapshot) => {
        const conductoresDisponibles = querySnapshot
          .docChanges()
          .filter((change) => change.doc.data().disponible)
          .map((change) => {
            console.table([
              change.doc.id,
              change.doc.data().nombre,
              change.doc.data().celular,
              change.doc.distance,
              change.doc.data().disponible,
              change.doc.data().ordenesPendientes,
            ]);

            return {
              id: change.doc.id,
              nombre: change.doc.data().nombre,
              celular: change.doc.data().celular,
              distancia: change.doc.distance,
              ordenesPendientes: change.doc.data().ordenesPendientes,
            };
          });

        // Obtiene los conductores no disponibles
        const conductoresNoDisponibles = querySnapshot
          .docChanges()
          .filter((change) => change.doc.data().disponible === false)
          .map((change) => {
            console.table([
              change.doc.id,
              change.doc.data().nombre,
              change.doc.data().celular,
              change.doc.distance,
              change.doc.data().disponible,
              change.doc.data().ordenesPendientes,
            ]);

            return {
              id: change.doc.id,
              nombre: change.doc.data().nombre,
              celular: change.doc.data().celular,
              distancia: change.doc.distance,
              ordenesPendientes: change.doc.data().ordenesPendientes,
            };
          });

        console.log("Conductores Disponibles:", conductoresDisponibles);

        // Obtiene el valor minimo de ordenes pendientes
        const valorMinimo =
          conductoresDisponibles.length > 0
            ? Math.min(
                ...conductoresDisponibles.map((item) => item.ordenesPendientes)
              )
            : Math.min(
                ...conductoresNoDisponibles.map(
                  (item) => item.ordenesPendientes
                )
              );

        // Obtiene los conductores con ordenes pendientes menores
        const conductoresMenosOrdenes =
          conductoresDisponibles.length > 0
            ? conductoresDisponibles.filter(
                (item) => item.ordenesPendientes === valorMinimo
              )
            : conductoresNoDisponibles.filter(
                (item) => item.ordenesPendientes === valorMinimo
              );

        // Ordena por distancia los conductores con ordenes pendientes menores
        const conductorMasCernano = conductoresMenosOrdenes.sort(function (
          a,
          b
        ) {
          if (a.distancia > b.distancia) {
            return 1;
          }
          if (a.distancia < b.distancia) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        console.table([
          "CONDUCTOR SELECCIONADO",
          conductorMasCernano[0].id,
          conductorMasCernano[0].nombre,
          conductorMasCernano[0].celular,
          conductorMasCernano[0].distancia,
          conductorMasCernano[0].ordenesPendientes,
        ]);

        // Se agrega los datos base del conductor seleccionado a la orden
        orden.conductornombre = conductorMasCernano[0].nombre;
        orden.conductorcelular = conductorMasCernano[0].celular;
        orden.conductorId = conductorMasCernano[0].id;

        // Se guarda nombre y celular del conductor seleccionado para mostrar en el modal
        setNombreConductor(conductorMasCernano[0].nombre);
        setCelularConductor(conductorMasCernano[0].celular);

        // Se suma la orden pendiente al conductor seleccionado
        const sumaOrdenesPendientes =
          conductorMasCernano[0].ordenesPendientes + 1;

        // Se guarda la orden pendiente al conductor seleccionado
        firebase.db
          .collection("conductores")
          .doc(conductorMasCernano[0].id)
          .update({
            ordenesPendientes: sumaOrdenesPendientes,
          });

        // Guarda la orden en el conductor mas cercano
        firebase.db
          .collection("conductores")
          .doc(conductorMasCernano[0].id)
          .collection("notificaciones")
          .doc(ordenid)
          .set(orden);

        // Actualiza la orden en el negocio
        firebase.db
          .collection("restaurantes")
          .doc(orden.orden[0].restauranteId)
          .collection("ordenes")
          .doc(ordenid)
          .update(orden);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Completa el estado de una orden
  const verificarPago = (ordenid) => {
    console.log(ordenid);
    try {
      firebase.db
        .collection("clientes")
        .doc(orden.clienteId)
        .collection("ordenes")
        .doc(ordenid)
        .update({ verificado: true });

      firebase.db
        .collection("restaurantes")
        .doc(orden.restauranteId)
        .collection("ordenes")
        .doc(ordenid)
        .update({ verificado: true });
    } catch (error) {
      console.log(error);
    }
  };

  const ConfirmarEliminarOrden = (ordenid) => {
    try {
      firebase.db
        .collection("clientes")
        .doc(orden.clienteId)
        .collection("ordenes")
        .doc(ordenid)
        .delete();

      firebase.db
        .collection("restaurantes")
        .doc(orden.restauranteId)
        .collection("ordenes")
        .doc(ordenid)
        .delete();
    } catch (error) {
      console.log(error);
    }
  };

  function showCaptura() {
    setVisibleCaptura(true);
  }

  function hideCaptura() {
    setVisibleCaptura(false);
  }

  function showConductorSeleccion() {
    setVisibleConductorSeleccion(true);
  }

  function hideConductorSeleccion() {
    setVisibleConductorSeleccion(false);
  }

  function showModalEliminar() {
    setVisibleModalEliminar(true);
  }

  function hideModalEliminar() {
    setVisibleModalEliminar(false);
  }

  return (
    <>
      <div>
        <Rodal
          visible={visibleCaptura}
          onClose={() => hideCaptura()}
          width={400}
          height={500}
        >
          <img
            src={orden.capturapago}
            className="rounded-md h-full w-full "
            alt="imagen captura"
          />
        </Rodal>
      </div>

      <div>
        <Rodal
          visible={visibleConductorSeleccion}
          onClose={() => hideConductorSeleccion()}
          width={400}
          height={150}
        >
          {nombreConductor ? (
            <>
              <h1 className="block text-white bg-gray-800 font-bold mt-5 text-center">
                CONDUCTOR SELECCIONADO
              </h1>
              <h1 className="block text-gray-800 font-bold mt-2 text-center">
                {nombreConductor}
              </h1>
              <h1 className="block text-gray-800 font-bold mt-2 text-center">
                {celularConductor}
              </h1>
            </>
          ) : (
            <>
              <h1 className="block text-white bg-gray-800 font-bold mt-5 text-center">
                NO SE HA ENCONTRADO CONDUCTOR
              </h1>
              <h1 className="block text-gray-800 font-bold mt-2 text-center">
                En este momento no existen conductores disponibles
              </h1>
            </>
          )}
        </Rodal>
      </div>

      <div>
        <Rodal
          visible={visibleModalEliminar}
          onClose={() => hideModalEliminar()}
          width={300}
          height={150}
        >
          <h1 className="block text-white bg-gray-800 font-bold mt-5 text-center">
            Desea eliminar ésta orden?
          </h1>
          <div className="text-center">
            <button
              className="bg-orange-800 hover:bg-orange-700 inline-block mt-6 mb-5 h1-2 text-white text-xs uppercase font-bold items-center"
              onClick={() => ConfirmarEliminarOrden(orden.id)}
            >
              {" "}
              Confirmar
            </button>
          </div>
        </Rodal>
      </div>
      <tbody className="bg-white">
        <tr>
          <td className="px-6 py-4 whitespace-no-wrap border-b ">
            <div className="flex items-center">
              <div>
                <div className="text-sm leading-5 text-gray-800">
                  {orden.id.substr(15)}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-no-wrap border-b  text-gray-800 text-sm leading-5">
            <h1>
              {new Date(orden.creado).toLocaleDateString("es-ES", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </h1>
            <h1>{new Date(orden.creado).toLocaleTimeString()}</h1>
          </td>
          <td className="px-6 py-4 whitespace-no-wrap border-b ">
            <div className="text-sm leading-5 text-gray-800">
              <h1 className="">{orden.clientenombre}</h1>
              <h1 className="">{orden.clientetelefono}</h1>
            </div>
          </td>
          {/* <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-800  text-sm leading-5">
            {orden.clientetelefono}
          </td> */}
          <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-800  text-sm leading-5">
            {orden.orden.flatMap((platos, index) => (
              // key={orden.id} o key={index} para eliminar un error de keys
              <>
                <h1 key={index} className="text-gray-800">
                  {platos.cantidad} {platos.nombre} ${platos.precio.toFixed(2)}
                </h1>

                {platos.ingredientes && (
                  <h1 className="text-gray-900">Extras</h1>
                )}
                {platos.ingredientes &&
                  platos.ingredientes.flatMap((ingrediente, index) => (
                    // key={orden.id} o key={index} para eliminar un error de keys
                    <div key={index} className="flex text-gray-800">
                      <div>{ingrediente.nombre}</div>
                      <div>${ingrediente.precio}</div>
                    </div>
                  ))}
              </>
            ))}
          </td>

          <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-800  text-sm leading-5">
            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
              <span
                aria-hidden
                className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
              ></span>
              <span className="relative text-xs">
                ${orden.pagototal.toFixed(2)}
              </span>
            </span>
          </td>

          <td className="px-6 py-4 whitespace-no-wrap border-b  text-gray-800 text-sm leading-5">
            {orden.referenciabanesco && (
              <div>
                <h1 className="block  ">Banco Banesco</h1>
                <h1 className="">Referencia {orden.referenciabanesco}</h1>
              </div>
            )}

            {orden.emailzelle && (
              <div>
                <h1 className="block  ">Zelle</h1>
                <h1 className="">{orden.emailzelle}</h1>
                <h1 className="">{orden.nombrezelle}</h1>
              </div>
            )}

            {orden.referenciaplaza && (
              <div>
                <h1 className="block  ">Banco Plaza</h1>
                <h1 className="">Referencia {orden.referenciaplaza}</h1>
              </div>
            )}

            {orden.referenciapagomovilplaza && (
              <div>
                <h1 className="block  ">Pago Móvil Banco Plaza</h1>
                <h1 className="">
                  Referencia {orden.referenciapagomovilplaza}
                </h1>
              </div>
            )}

            {orden.cantidadefectivo && (
              <div>
                <h1 className="block  ">Efectivo</h1>
                <h1 className="">${orden.cantidadefectivo}</h1>
              </div>
            )}

            <button
              className="flex px-5 py-2 mt-1 border-green-600 border text-green-600 rounded transition duration-300 hover:bg-green-600 hover:text-white focus:outline-none"
              onClick={() => showCaptura()}
            >
              Mostrar
            </button>
          </td>

          {!orden.verificado && orden.capturapago && (
            <td className="py-4 whitespace-no-wrap text-right border-b  text-sm leading-5">
              <button
                onClick={() => verificarPago(orden.id)} // Este boton se puede cambiar por un check
                type="submit"
                className="flex px-5 py-2 border-green-600 border text-green-600 rounded transition duration-300 hover:bg-green-600 hover:text-white focus:outline-none"
              >
                Verificar
              </button>
            </td>
          )}

          {orden.verificado && (
            <td className="py-4 whitespace-no-wrap text-right border-b text-gray-800  text-sm leading-5">
              {orden.conductornombre ? (
                <>
                  <h1 className="flex">{orden.conductornombre}</h1>

                  <h1 className="flex">{orden.conductorcelular}</h1>
                </>
              ) : (
                <button
                  type="button"
                  className="flex px-5 py-2 border-green-600 border text-green-600 rounded transition duration-300 hover:bg-green-600 hover:text-white focus:outline-none"
                  onClick={() => {
                    buscarConductor(orden.id);
                    showConductorSeleccion();
                  }}
                >
                  Asignar
                </button>
              )}
            </td>
          )}

          {orden.entregado && (
            <td className="px-6 py-4 whitespace-no-wrap border-b ">
              <div className="text-sm leading-5 text-gray-800">
                {orden.tiempoentrega} min.
              </div>
            </td>
          )}

          {!orden.entregado && !orden.conductornombre && (
            <td className="py-4 whitespace-no-wrap text-right border-b  text-sm leading-5">
              <button
                onClick={() => {
                  showModalEliminar();
                }}
                type="submit"
                className="flex px-5 py-2 border-red-600 border text-red-600 rounded transition duration-300 hover:bg-red-600 hover:text-white focus:outline-none"
              >
                Eliminar
              </button>
            </td>
          )}
        </tr>
      </tbody>
    </>
  );
};

export default Orden;
