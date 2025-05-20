import React, { useEffect, useState, useContext } from "react";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext";

import Orden from "../ui/Orden";

const OrdenesEntregadas = () => {
    //state de ordenes pendientes
    const [ordenesEntregadas, setOrdenesEntregadas] = useState([]);

    // Context con las operaciones de firebase
    const { firebase } = useContext(FirebaseContext);

    // Para acceder a los datos del negocio a editar
    const { restauranteseleccionado } = useContext(PedidoContext);

    useEffect(() => {
        if (restauranteseleccionado) {
            // Guarda el id del negocio en la localStorage
            localStorage.setItem("idrestaurante", restauranteseleccionado.id);

            const unsubscribe = firebase.db
                .collection("restaurantes")
                .doc(restauranteseleccionado.id)
                .collection("ordenes")
                .where("verificado", "==", true)
                .where("entregado", "==", true)
                .onSnapshot(manejarSnapshot);

            return () => {
                // Unmouting
                unsubscribe();
            };
        } else {
            // Usa el id guardado en localStorage
            const unsubscribe = firebase.db
                .collection("restaurantes")
                .doc(localStorage.getItem("idrestaurante"))
                .collection("ordenes")
                .where("verificado", "==", true)
                .where("entregado", "==", true)
                .onSnapshot(manejarSnapshot);

            return () => {
                // Unmouting
                unsubscribe();
            };
        }
    }, [firebase.db, restauranteseleccionado]); // firebase.db, restauranteseleccionado

    function manejarSnapshot(snapshot) {
        const ordenesEntregadas = snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        setOrdenesEntregadas(ordenesEntregadas);
    }

    return (
        <>
            <div className=" py-2 overflow-x-auto sm:-mx-6 sm:px-3 ">
                <div className="align-middle inline-block min-w-full shadow-xl overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg mb-6">
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
                                {/* <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider">
                  Teléfono
                </th> */}
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider">
                                    Productos
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider ">
                                    Método pago
                                </th>

                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider ">
                                    Repartidor
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-orange-600 tracking-wider ">
                                    Tiempo entrega
                                </th>

                                <th className="px-3 py-3 border-b-2 border-gray-300"></th>
                            </tr>
                        </thead>

                        {ordenesEntregadas
                            .sort(function (a, b) {
                                // Ordena por fecha
                                return new Date(b.creado) - new Date(a.creado);
                            })
                            .map((orden) => (
                                <Orden key={orden.id} orden={orden} />
                            ))}
                    </table>
                </div>
            </div>
        </>
    );
};

export default OrdenesEntregadas;
