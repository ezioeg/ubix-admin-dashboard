import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext"; // Cambiar nombre

import Negocio from "../ui/Negocio";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import aviso from "../../sounds/r2d2_sms.mp3";

const Negocios = () => {
    // State Para alojar los datos del negocio
    const [restaurantes, setRestaurantes] = useState([]);
    const [negocios, setNegocios] = useState([]);
    const { firebase } = useContext(FirebaseContext);
    const { seleccionarNegocio } = useContext(PedidoContext);

    const tono = new Audio(aviso);
    const playSound = (audioFile) => {
        audioFile.play();
    };
    const notify = () => {
        toast.error("Ordenes sin verificar!");
        playSound(tono);
    };

    useEffect(() => {
        function manejarSnapshot(snapshot) {
            const negocios = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });

            // almacenar los negocios en el estado
            console.log(negocios);
            setNegocios(negocios);
        }

        const unsubscribe = firebase.db
            .collection("categorias")
            .onSnapshot(manejarSnapshot);

        return () => {
            // Unmouting
            unsubscribe();
        };
    }, [firebase.db]); // firebase.db

    useEffect(() => {
        function manejarSnapshot(snapshot) {
            const restaurantes = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });

            // almacenar los negocios en el estado
            setRestaurantes(restaurantes);
        }

        const unsubscribe = firebase.db
            .collection("restaurantes")
            .onSnapshot(manejarSnapshot);

        return () => {
            // Unmouting
            unsubscribe();
        };
    }, [firebase.db]); // firebase.db

    return (
        <div className="p-6">
            <div className="grid lg:grid-cols-4">
                {negocios
                    .sort(function (a, b) {
                        // Ordena por nombre
                        return a.nombre.localeCompare(b.nombre);
                    })
                    .map((negocio) => (
                        <Link
                            key={negocio.id}
                            className="bg-white-800 hover:bg-orange-700 border-2 border-gray-800 mb-4 p-2 ml-2 text-gray-800 text-sm flex justify-center font uppercase font-bold rounded"
                            to="/crear-negocio"
                            onClick={() => {
                                seleccionarNegocio(negocio);
                            }}
                        >
                            {negocio.nombre}
                        </Link>
                    ))}
            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-800">Negocios</h1>

            <>
                {/* <Link
                    className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 text-white uppercase font-bold rounded"
                    to="/crear-negocio"
                >
                    {" "}
                    Crear Negocio
                </Link> */}

                {restaurantes.map((restaurante) => (
                    <Negocio
                        key={restaurante.id}
                        restaurante={restaurante}
                        activarNotificacion={notify}
                    />
                ))}
            </>
            <ToastContainer />
        </div>
    );
};

export default Negocios;
