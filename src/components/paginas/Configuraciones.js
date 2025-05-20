import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase"; //index

const Configuraciones = () => {
    // State para las imagenes de platos

    const [configs, setConfigs] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        firebase.db
            .collection("configuraciones")
            .doc("0")
            .onSnapshot(function (doc) {
                const configs = {
                    ...doc.data(),
                };
                //   console.log(config);
                setConfigs(configs);
            });
    }, [firebase.db]);

    //Hook para redireccionar
    const navigate = useNavigate();

    // Validacion y leer los datos del formulario
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            tasa: !!configs && !!configs.tasa ? configs.tasa : 0,
        },
        validationSchema: Yup.object({
            tasa: Yup.number()
                .min(3, "La tasa es a partir de 3 BsS")
                .required("La tasa de dólar es obligatoria"),
        }),
        onSubmit: (config) => {
            try {
                let collectionRef = firebase.db.collection("configuraciones");

                collectionRef.doc("0").update(config);

                // Redireccionar
                navigate("/"); // negocios
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <>
            <div className="flex h-full bg-gray-200 items-center justify-center">
                <div className="grid bg-white rounded-lg shadow-xl w-11/12 md:w-9/12 lg:w-1/2 px-10">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex justify-center">
                            <div className="flex">
                                <h1 className="text-gray-700 font-bold md:text-2xl text-xl pt-10 pb-4">
                                    Configuración general
                                </h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Tasa dólar
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="tasa"
                                type="number"
                                placeholder="4 BsS"
                                step="0.01"
                                min="0"
                                // max="30"
                                value={formik.values.tasa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.tasa && formik.errors.tasa && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.tasa}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
                            <button
                                type="submit"
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Configuraciones;
