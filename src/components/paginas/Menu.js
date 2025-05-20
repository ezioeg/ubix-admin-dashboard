import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext"; // Cambiar nombre

import Plato from "../ui/Plato";

const Menu = () => {
    // State para alojar los datos de los platos
    const [platos, setPlatos] = useState([]);
    const [q, setQ] = useState("");
    const { firebase } = useContext(FirebaseContext);

    // Para acceder a los datos del negocio a editar
    const { restauranteseleccionado } = useContext(PedidoContext);
    // console.log(restauranteseleccionado);

    useEffect(() => {
        if (restauranteseleccionado) {
            // Guarda el id del negocio en la localStorage
            localStorage.setItem("idrestaurante", restauranteseleccionado.id);

            const unsubscribe = firebase.db
                .collection("restaurantes")
                .doc(restauranteseleccionado.id)
                .collection("productos")
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
                .collection("productos")
                .onSnapshot(manejarSnapshot);

            return () => {
                // Unmouting
                unsubscribe();
            };
        }
    }, [firebase.db, restauranteseleccionado]); // firebase.db, restauranteseleccionado

    function manejarSnapshot(snapshot) {
        const platos = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });

        // almacenar los platos en el estado
        setPlatos(platos);
    }

    function search(rows) {
        return rows.filter(
            (row) =>
                row.nombre.toString().toLowerCase().indexOf(q.toLowerCase()) >
                    -1 ||
                row.descripcion
                    .toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1 ||
                row.categoria
                    .toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1 ||
                row.precio.toString().toLowerCase().indexOf(q.toLowerCase()) >
                    -1
        );
    }

    return (
        <>
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Menú</h1>
                <Link
                    className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 text-white uppercase font-bold rounded"
                    to="/crear-plato"
                >
                    {" "}
                    Crear Plato
                </Link>

                <div className="h-12 px-2 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none">
                    <div className="flex flex-wrap items-stretch w-full h-full mb-6 relative">
                        <input
                            type="text"
                            className="flex-shrink flex-grow flex-auto leading-normal tracking-wide w-px border border-none border-l-0 rounded rounded-l-none px-3 relative focus:outline-none  lg:text-md text-gray-800"
                            placeholder="Buscar plato"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                </div>

                <div className=" my-3">
                    <div className="flex flex-wrap">
                        {search(platos)
                            .sort(function (a, b) {
                                // Ordena por nombre
                                return a.nombre.localeCompare(b.nombre);
                            })
                            .map((plato) => (
                                <Plato key={plato.id} plato={plato} />
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Menu;
