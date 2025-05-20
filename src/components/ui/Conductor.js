import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext"; // Cambiar nombre

// import Mapa from "../ui/Mapa";

// Para los Modales
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const Conductor = ({ conductor }) => {
    const [ordenesEntrantes, setOrdenesEntrantes] = useState([]);
    const [visibleModalEliminar, setVisibleModalEliminar] = useState(false);

    // disponible ref para acceder al valor directamente
    const disponibleRef = useRef(conductor.disponible);

    // Context de firebase para cambios en la base de datos
    const { firebase } = useContext(FirebaseContext);
    // Uso del contexto de pedido cambiar nombre
    const { seleccionarConductor } = useContext(PedidoContext);

    const { id, nombre, cedula, celular, imagen, placa, disponible } =
        conductor;

    useEffect(() => {
        // Para saber el numero de ordenes entrantes
        const unsubscribe = firebase.db
            .collection("conductores")
            .doc(id)
            .collection("notificaciones")
            .where("entregado", "==", false)
            .onSnapshot(manejarSnapshot);

        return () => {
            // Unmouting
            unsubscribe();
        };
    }, [firebase.db, id]); // firebase.db

    function manejarSnapshot(snapshot) {
        const ordenesEntrantes = snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        setOrdenesEntrantes(ordenesEntrantes);
    }

    ///modificar el estado del conductor en firebase
    const actualizarDisponible = () => {
        const disponible = disponibleRef.current.value === "true";

        try {
            firebase.db
                .collection("conductores")
                .doc(id)
                .update({ disponible });
        } catch (error) {
            console.log(error);
        }
    };

    function showModalEliminar() {
        setVisibleModalEliminar(true);
    }

    function hideModalEliminar() {
        setVisibleModalEliminar(false);
    }

    function ConfirmarEliminarRestaurante(idconductor) {
        try {
            firebase.db.collection("conductores").doc(idconductor).delete();

            // Elimina tambien la imagen
            let imageRef = firebase.storage.refFromURL(imagen);
            imageRef.delete();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-xl bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-3/12">
                        <img
                            src={imagen}
                            alt="imagen conductor"
                            className="rounded-md h-48"
                        />

                        <div className="sm:flex sm:-mx-2 pl-2">
                            <label className="block mt-5 sm:w-4/4">
                                <span className="block text-gray-800 mb-2">
                                    {" "}
                                    Disponible
                                </span>
                                <select
                                    className="bg-white shadow appearance-none border rounded w-full py-2 px-2 leading-tight focus:outline-none"
                                    value={disponible}
                                    ref={disponibleRef}
                                    onChange={() => actualizarDisponible()}
                                >
                                    <option value="true"> Si</option>
                                    <option value="false"> No</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-5/12 xl:w-5/12 pl-5">
                        <p className="font-bold text-2xl text-orange-600 mb-2">
                            {" "}
                            {nombre}
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            CI: {""}
                            <span className="text-gray-600">{cedula}</span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Celular: {""}
                            <span className="text-gray-600">{celular}</span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Placa: {""}
                            <span className="text-gray-600">{placa}</span>
                        </p>

                        <div>
                            <Link
                                className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 text-white uppercase font-bold rounded"
                                to="/editar-conductor"
                                onClick={() => seleccionarConductor(conductor)}
                            >
                                {" "}
                                Editar
                            </Link>
                            <Link
                                className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 ml-2 text-white uppercase font-bold rounded"
                                to="/ordenes-conductor"
                                onClick={() => seleccionarConductor(conductor)}
                            >
                                {" "}
                                Ordenes
                                <div className="absolute bg-red-600 rounded-full h-6 w-6 flex justify-center items-center">
                                    <p className="text-white text-xs">
                                        {ordenesEntrantes.length}
                                    </p>
                                </div>
                            </Link>
                            <button
                                type="button"
                                className="bg-orange-800 hover:bg-orange-700 mb-5 p-2 ml-2 text-white uppercase font-bold rounded"
                                onClick={() => {
                                    seleccionarConductor(conductor);
                                    showModalEliminar();
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                    <div>
                        <Rodal
                            visible={visibleModalEliminar}
                            onClose={() => hideModalEliminar()}
                            width={400}
                            height={170}
                        >
                            <p className="block text-white bg-gray-800 font-bold mt-5 text-center">
                                Esta seguro de eliminar este conductor?
                            </p>

                            <p className="block text-gray-700 font-bold mt-3 text-center">
                                Se eliminaran los datos y ordenes!
                            </p>
                            <div className="text-center">
                                <button
                                    className="bg-orange-800 hover:bg-orange-700 inline-block mt-6 mb-5 p-2 text-white text-xs uppercase font-bold items-center rounded"
                                    onClick={() =>
                                        ConfirmarEliminarRestaurante(id)
                                    }
                                >
                                    {" "}
                                    Confirmar
                                </button>
                            </div>
                        </Rodal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Conductor;
