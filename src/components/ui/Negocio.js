import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext"; // Cambiar nombre

import Mapa from "../ui/Mapa";

// Para los Modales
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const Negocio = ({ restaurante, activarNotificacion }) => {
    //state de ordenes
    const [ordenesEntrantes, setOrdenesEntrantes] = useState([]);
    const [visibleMapa, setVisibleMapa] = useState(false);
    const [visibleModalEliminar, setVisibleModalEliminar] = useState(false);

    // abierto ref para acceder al valor directamente
    const abiertoRef = useRef(restaurante.abierto);

    // descuento general ref para acceder al valor directamente
    // const descuentoGeneralRef = useRef(restaurante.descuentoGeneral);

    // Context de firebase para cambios en la base de datos
    const { firebase } = useContext(FirebaseContext);
    // Uso del contexto de pedido cambiar nombre
    const { seleccionarRestaurante } = useContext(PedidoContext);

    const {
        id,
        nombre,
        imagen,
        negocioTipo,
        descripcion,
        abierto,
        categorias,
        // tasa,
        descuentoGeneral,
        apertura,
        cierre,
    } = restaurante;

    useEffect(() => {
        // Para saber el numero de ordenes entrantes
        const unsubscribe = firebase.db
            .collection("restaurantes")
            .doc(id)
            .collection("ordenes")
            .where("verificado", "==", false)
            // .where("entregado", "==", false)
            .onSnapshot(manejarSnapshot);

        return () => {
            // Unmouting
            unsubscribe();
        };
    }, [firebase.db, id]); // firebase.db

    useEffect(() => {
        if (ordenesEntrantes.length > 0) {
            activarNotificacion();
        }
        // eslint-disable-next-line
    }, [ordenesEntrantes]);

    function manejarSnapshot(snapshot) {
        const ordenesEntrantes = snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        setOrdenesEntrantes(ordenesEntrantes);
    }

    ///modificar el estado del negocio en firebase
    const actualizarAbierto = () => {
        const abierto = abiertoRef.current.value === "true";

        try {
            firebase.db.collection("restaurantes").doc(id).update({ abierto });
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

    function ConfirmarEliminarRestaurante(idrestaurante) {
        try {
            firebase.db.collection("restaurantes").doc(idrestaurante).delete();

            // Elimina tambien la imagen
            let imageRef = firebase.storage.refFromURL(imagen);
            imageRef.delete();
        } catch (error) {
            console.log(error);
        }
    }

    //agregar descuento a todos los productos
    // const agregarDescuentoGeneral = () => {
    //   const descuentoGeneral = descuentoGeneralRef.current.value;
    //   let collectionRef = firebase.db.collection("restaurantes");

    //   try {
    //     collectionRef.doc(id).update({ descuentoGeneral });

    //     collectionRef
    //       .doc(id)
    //       .collection("productos")
    //       .get()
    //       .then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //           doc.ref.update({
    //             descuentoPorcentaje: descuentoGeneral,
    //           });
    //         });
    //       });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    function showMapa() {
        setVisibleMapa(true);
    }

    function hideMapa() {
        setVisibleMapa(false);
    }

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-xl bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-3/12 pt-6">
                        <div className="flex justify-center">
                            <img
                                src={imagen}
                                alt="imagen negocio"
                                className="rounded-md h-48 "
                            />
                        </div>

                        <div className="sm:flex sm:-mx-2 pl-2">
                            <label className="block mt-5 ml-3 sm:w-4/4">
                                <span className="block text-gray-800 mb-2">
                                    {" "}
                                    Abierto
                                </span>
                                <select
                                    className="bg-white shadow appearance-none border rounded w-full py-2 px-2 leading-tight focus:outline-none"
                                    value={abierto}
                                    ref={abiertoRef}
                                    onChange={() => actualizarAbierto()}
                                >
                                    <option value="true"> Si</option>
                                    <option value="false"> No</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-10/12 xl:w-10/12 pl-5 pt-4">
                        <p className="font-bold text-2xl text-orange-600 mb-2">
                            {" "}
                            {nombre}
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Tipo de negocio: {""}
                            <span className="text-gray-600">{negocioTipo}</span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Descripción: {""}
                            <span className="text-gray-600">{descripcion}</span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Categoría: {""}
                            <span className="text-gray-600">{categorias}</span>
                        </p>

                        {/* <p className="text-gray-700 font-bold mb-2">
                            Tasa dólar:
                            <span className="text-gray-600"> {tasa} BsS</span>
                        </p> */}

                        <p className="text-gray-700 font-bold mb-2">
                            Descuento General:
                            <span className="text-gray-600">
                                {" "}
                                {descuentoGeneral}%
                            </span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Horario:
                            {apertura >= "12:00" ? (
                                <span className="text-gray-600 pl-1">
                                    {apertura} pm - {cierre} pm
                                </span>
                            ) : (
                                <span className="text-gray-600 pl-1">
                                    {apertura} am - {cierre} pm
                                </span>
                            )}
                        </p>

                        <div>
                            <Link
                                className="bg-orange-800 hover:bg-orange-700 inline-block mb-4 p-2 text-white text-sm uppercase font-bold rounded "
                                to="/editar-negocio"
                                onClick={() =>
                                    seleccionarRestaurante(restaurante)
                                }
                            >
                                {" "}
                                Editar
                            </Link>
                            <Link
                                className="bg-orange-800 hover:bg-orange-700 inline-block mb-4 p-2 ml-2 text-white text-sm uppercase font-bold rounded"
                                to="/menu"
                                onClick={() =>
                                    seleccionarRestaurante(restaurante)
                                }
                            >
                                {" "}
                                Menu
                            </Link>
                            <Link
                                className="bg-orange-800 hover:bg-orange-700 inline-block mb-4 p-2 ml-2 text-white text-sm uppercase font-bold rounded"
                                to="/ordenes"
                                onClick={() =>
                                    seleccionarRestaurante(restaurante)
                                }
                            >
                                {" "}
                                Ordenes
                                <div className="absolute bg-red-600 rounded-full h-6 w-6 flex justify-center items-center">
                                    <p className="text-white text-xs">
                                        {ordenesEntrantes.length}
                                    </p>
                                </div>
                            </Link>

                            <Link
                                className="bg-orange-800 hover:bg-orange-700 inline-block mb-4 p-2 ml-2 text-white text-sm uppercase font-bold rounded"
                                to="/pagos"
                                onClick={() =>
                                    seleccionarRestaurante(restaurante)
                                }
                            >
                                {" "}
                                Pagos
                            </Link>

                            <button
                                type="button"
                                className="bg-orange-800 hover:bg-orange-700 mb-4 p-2 ml-2 text-white text-sm font uppercase font-bold rounded"
                                onClick={() => {
                                    showMapa();
                                }}
                            >
                                {" "}
                                Mapa
                            </button>

                            <button
                                type="button"
                                className="bg-orange-800 hover:bg-orange-700 mb-4 p-2 ml-2 text-white text-sm font uppercase font-bold rounded"
                                onClick={() => {
                                    seleccionarRestaurante(restaurante);
                                    showModalEliminar();
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>

                    {/* Modales */}
                    <div>
                        <Rodal
                            visible={visibleMapa}
                            onClose={() => hideMapa()}
                            width={450}
                            height={350}
                        >
                            <p className="block text-white bg-gray-800 font-bold mt-5  text-center p-1">
                                UBICACIÓN
                            </p>
                            <div className="w-full h-full">
                                <Mapa id={id} />
                            </div>
                        </Rodal>
                    </div>
                    <div>
                        <Rodal
                            visible={visibleModalEliminar}
                            onClose={() => hideModalEliminar()}
                            width={400}
                            height={170}
                        >
                            <p className="block text-white bg-gray-800 font-bold mt-5 text-center">
                                Esta seguro de eliminar este negocio?
                            </p>

                            <p className="block text-gray-700 font-bold mt-3 text-center">
                                Se eliminaran los datos, productos y ordenes!
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

export default Negocio;
