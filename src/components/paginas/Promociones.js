import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { FirebaseContext } from "../../firebase"; //index

import Promocion from "../ui/Promocion";

const Promociones = () => {
    // State Para alojar los datos de la promocion
    const [promociones, setPromociones] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        function manejarSnapshot(snapshot) {
            const promociones = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });

            // almacenar los promociones en el estado
            setPromociones(promociones);
        }

        const unsubscribe = firebase.db
            .collection("promociones")
            .onSnapshot(manejarSnapshot);

        return () => {
            // Unmouting
            unsubscribe();
        };
    }, [firebase.db]); // firebase.db

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Promociones
            </h1>
            <>
                <Link
                    className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 text-white uppercase font-bold rounded"
                    to="/crear-promocion"
                >
                    Crear Promoción
                </Link>

                {promociones.map((promocion) => (
                    <Promocion key={promocion.id} promocion={promocion} />
                ))}
            </>
        </div>
    );
};

export default Promociones;
