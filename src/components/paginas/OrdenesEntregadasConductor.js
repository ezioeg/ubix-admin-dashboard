import React, { useEffect, useState, useContext } from "react";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext";

import OrdenConductor from "../ui/OrdenConductor";

const OrdenesEntregadasConductor = () => {
  //state de ordenes de conductor
  const [ordenes, setOrdenes] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  // Para acceder a los datos del conductor a editar
  const { conductorseleccionado } = useContext(PedidoContext);

  useEffect(() => {
    if (conductorseleccionado) {
      // Guarda el id del conductor en la localStorage
      localStorage.setItem("ideconductor", conductorseleccionado.id);

      const unsubscribe = firebase.db
        .collection("conductores")
        .doc(conductorseleccionado.id)
        .collection("notificaciones")
        .where("entregado", "==", true)
        .onSnapshot(manejarSnapshot);

      return () => {
        // Unmouting
        unsubscribe();
      };
    } else {
      // Usa el id guardado en localStorage
      const unsubscribe = firebase.db
        .collection("conductores")
        .doc(localStorage.getItem("ideconductor"))
        .collection("notificaciones")
        .where("entregado", "==", true)
        .onSnapshot(manejarSnapshot);

      return () => {
        // Unmouting
        unsubscribe();
      };
    }
  }, [firebase.db, conductorseleccionado]); // firebase.db, conductorseleccionado

  function manejarSnapshot(snapshot) {
    const ordenes = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setOrdenes(ordenes);
  }

  return (
    <>
      <div className=" py-2 overflow-x-auto sm:-mx-6 sm:px-3 ">
        <div className="align-middle inline-block min-w-full shadow-xl overflow-hidden bg-white shadow-dashboard px-2 pt-3 rounded-bl-lg rounded-br-lg mb-6  ">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-orange-600 tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider">
                  Fecha/Hora
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider">
                  Productos
                </th>

                {/* <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider ">
                  Método pago
                </th> */}
              </tr>
            </thead>

            {ordenes
              .sort(function (a, b) {
                // Ordena por fecha
                return new Date(b.creado) - new Date(a.creado);
              })
              .map((orden) => (
                <OrdenConductor key={orden.id} orden={orden} />
              ))}
          </table>
        </div>
      </div>
    </>
  );
};

export default OrdenesEntregadasConductor;
