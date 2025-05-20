import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext"; // Cambiar nombre

// Para los Modales
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const Plato = ({ plato }) => {
    const [visibleModalEliminar, setVisibleModalEliminar] = useState(false);
    // Existencia ref para acceder al valor directamente
    const existenciaRef = useRef(plato.existencia);

    const { firebase } = useContext(FirebaseContext);
    // Uso del contexto de pedido cambiar nombre
    const { seleccionarPlato } = useContext(PedidoContext);

    const {
        id,
        nombre,
        precio,
        categoria,
        imagen,
        descripcion,
        existencia,
        descuentoPorcentaje,
        restauranteId,
    } = plato;

    // Modificar el estado del plato en firebase
    const actualizarDisponibilidad = () => {
        // Para crear negocio con el mismo id

        const existencia = existenciaRef.current.value === "true";

        try {
            firebase.db
                .collection("restaurantes")
                .doc(restauranteId)
                .collection("productos")
                .doc(id)
                .update({ existencia });
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

    function ConfirmarEliminarProducto(idrestaurante, idplato) {
        try {
            firebase.db
                .collection("restaurantes")
                .doc(idrestaurante)
                .collection("productos")
                .doc(idplato)
                .delete();

            // Elimina tambien la imagen
            let imageRef = firebase.storage.refFromURL(imagen);
            imageRef.delete();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full px-3 mb-4 xl:w-1/3 ">
            <div className="p-5 shadow-xl bg-white rounded-xl">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-4/12 pt-6">
                        <Link
                            className=""
                            to="/editar-plato"
                            onClick={() => seleccionarPlato(plato)}
                        >
                            <div className="flex justify-center">
                                <img
                                    src={imagen}
                                    alt="imagen plato"
                                    className="rounded-sm h-40 w-64"
                                />
                            </div>{" "}
                        </Link>
                        <div className="sm:flex sm:-mx-2 pl-2">
                            <label className="block mt-5 sm:w-4/4">
                                <span className="block text-gray-800 font-bold text-sm mb-2">
                                    {" "}
                                    Existencia
                                </span>
                                <select
                                    className="bg-white text-sm shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none"
                                    value={existencia}
                                    ref={existenciaRef}
                                    onChange={() => actualizarDisponibilidad()}
                                >
                                    <option value="true"> Disponible</option>
                                    <option value="false">
                                        {" "}
                                        No disponible
                                    </option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-7/12 xl:w-8/12 pl-5 pt-5 relative">
                        <h1 className="font-bold text-sm text-orange-600  pb-2">
                            {" "}
                            {nombre}
                        </h1>

                        <h1 className="text-gray-800 font-bold text-sm pb-1">
                            {categoria}
                        </h1>

                        <p className="text-gray-800 text-sm pb-1">
                            {descripcion}
                        </p>

                        {descuentoPorcentaje ? (
                            <>
                                <span className="text-gray-800 text-sm font-bold">
                                    $
                                    {(
                                        ((100 - descuentoPorcentaje) / 100) *
                                        precio
                                    ).toFixed(2)}{" "}
                                    (Descuento {descuentoPorcentaje}%)
                                </span>
                                <span className="text-red-600 text-sm line-through font-bold">
                                    ${precio}
                                </span>
                            </>
                        ) : (
                            <h1 className="text-gray-800 text-sm font-bold pb-2">
                                ${precio}
                            </h1>
                        )}
                        <div className="xl:absolute xl:bottom-0 right-0">
                            <button
                                className="bg-orange-800 hover:bg-orange-700   p-3  text-white text-xs  uppercase font-bold rounded"
                                onClick={() => {
                                    seleccionarPlato(plato);
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
                            Desea eliminar este producto?
                        </p>
                        <div className="text-center">
                            <button
                                className="bg-orange-800 hover:bg-orange-700 inline-block mt-6 mb-5 p-2 text-white text-xs uppercase font-bold items-center rounded"
                                onClick={() =>
                                    ConfirmarEliminarProducto(
                                        plato.restauranteId,
                                        plato.id
                                    )
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
    );
};

export default Plato;
