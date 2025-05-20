import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext"; // Cambiar nombre

// Para los Modales
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const Promocion = ({ promocion }) => {
    const [visibleModalEliminar, setVisibleModalEliminar] = useState(false);

    // disponible ref para acceder al valor directamente
    // const disponibleRef = useRef(promocion.disponible);

    // Context de firebase para cambios en la base de datos
    const { firebase } = useContext(FirebaseContext);

    const { seleccionarPromo } = useContext(PedidoContext);

    const { id, codigo, porcentaje, valor, contador, fecha } = promocion;

    function showModalEliminar() {
        setVisibleModalEliminar(true);
    }

    function hideModalEliminar() {
        setVisibleModalEliminar(false);
    }

    function confirmarEliminarPromo(idpromo) {
        try {
            firebase.db.collection("promociones").doc(idpromo).delete();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-xl bg-white">
                <div className="lg:flex flex-col">
                    {/* <div className="lg:w-5/12 xl:w-3/12"> */}
                    {/* <img
                            src={imagen}
                            alt="imagen promocion"
                            className="rounded-md h-48"
                        /> */}
                    {/* </div> */}
                    <div className=" pl-5 flex  items-center justify-between">
                        <p className="font-bold text-2xl text-orange-600 mb-2">
                            {codigo}
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Vence:
                            <span className="text-gray-600">
                                {" "}
                                {new Date(fecha).toLocaleDateString("es-ES", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Por porcentaje:
                            <span className="text-gray-600">
                                {" "}
                                {porcentaje}%
                            </span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Por valor:
                            <span className="text-gray-600"> {valor}$</span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Cant:
                            <span className="text-gray-600"> {contador}</span>
                        </p>

                        <div>
                            <Link
                                className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 text-white uppercase font-bold rounded"
                                to="/editar-promocion"
                                onClick={() => seleccionarPromo(promocion)}
                            >
                                {" "}
                                Editar
                            </Link>

                            <button
                                className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 ml-2 text-white uppercase font-bold rounded"
                                onClick={() => {
                                    seleccionarPromo(promocion);
                                    showModalEliminar();
                                }}
                            >
                                {" "}
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modales */}
                <div>
                    <Rodal
                        visible={visibleModalEliminar}
                        onClose={() => hideModalEliminar()}
                        width={300}
                        height={150}
                    >
                        <p className="block text-white bg-gray-800 font-bold mt-5 text-center">
                            Desea eliminar este código?
                        </p>
                        <div className="text-center">
                            <button
                                className="bg-orange-800 hover:bg-orange-700 inline-block mt-6 mb-5 p-2 text-white text-xs uppercase font-bold items-center rounded"
                                onClick={() => confirmarEliminarPromo(id)}
                            >
                                {" "}
                                Confirmar
                            </button>
                        </div>
                    </Rodal>
                </div>
            </div>
        </div>
    );
};

export default Promocion;
