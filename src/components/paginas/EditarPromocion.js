import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es"; // the locale you want

const EditarPromocion = () => {
    const [promoInfo, setPromoInfo] = useState([]);
    const [fecha, setFecha] = useState("");

    const { promoseleccionada } = useContext(PedidoContext);
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        setFecha(Date.parse(promoInfo.fecha));
    }, [promoInfo]);

    useEffect(() => {
        if (promoseleccionada) {
            localStorage.setItem("idpromo", promoseleccionada.id);

            const unsubscribe = firebase.db
                .collection("promociones")
                .doc(promoseleccionada.id)
                .onSnapshot(function (doc) {
                    const promo = {
                        id: doc.id,
                        ...doc.data(),
                    };

                    setPromoInfo(promo);
                });

            return () => {
                // Unmouting
                unsubscribe();
            };
        } else {
            // Usa el id guardado en localStorage
            const unsubscribe = firebase.db
                .collection("promociones")
                .doc(localStorage.getItem("idpromo"))
                .onSnapshot(function (doc) {
                    const promo = {
                        id: doc.id,
                        ...doc.data(),
                    };

                    setPromoInfo(promo);
                });
            return () => {
                // Unmouting
                unsubscribe();
            };
        }
    }, [firebase.db, promoseleccionada]); // firebase.db, promoseleccionada

    //Hook para redireccionar
    const navigate = useNavigate();

    // Validacion y leer los datos del formulario
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            codigo: !!promoInfo && !!promoInfo.codigo ? promoInfo.codigo : "",
            porcentaje:
                !!promoInfo && !!promoInfo.porcentaje
                    ? promoInfo.porcentaje
                    : 0,
            valor: !!promoInfo && !!promoInfo.valor ? promoInfo.valor : 0,
            contador:
                !!promoInfo && !!promoInfo.contador ? promoInfo.contador : 100,
        },
        validationSchema: Yup.object({
            codigo: Yup.string()
                .required("El código de promoción es obligatorio")
                .min(5, "El código debe tener mínimo 5 caracteres")
                .max(10, "El código debe tener máximo 10 caracteres"),
            porcentaje: Yup.number()
                .min(0, "Mínimo es 0%")
                .max(99, "Máximo es 99%")
                .required("el porcentaje minimo debe ser 0"),
            valor: Yup.number()
                .min(0, "Minimo es 0")
                .required("el valor minimo debe ser 0"),
            contador: Yup.number()
                .min(0, "Minimo es 0")
                .required("el contador minimo debe ser 0"),
        }),
        onSubmit: (promocion) => {
            try {
                if (typeof fecha !== "number") {
                    promocion.dia = fecha.getDate();
                    promocion.mes = fecha.getMonth() + 1;
                    promocion.fecha = fecha.toString();
                }

                promocion.codigo = promocion.codigo.toLowerCase();

                let collectionRef = firebase.db.collection("promociones");

                collectionRef
                    .doc(promoInfo.id) //
                    .update(promocion);

                // Redireccionar
                navigate("/promociones"); // promociones
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
                                    Actualizar Promoción
                                </h1>
                            </div>
                        </div>

                        <div className="flex justify-center items-center">
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={fecha}
                                className="border"
                                minDate={new Date()}
                                // maxDate={new Date()}
                                locale={es}
                                // onSelect={}
                                onChange={(fecha) => {
                                    // console.log("Dia: ", fecha.getDate());
                                    // console.log("Mes: ", fecha.getMonth() + 1);
                                    setFecha(fecha);
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Código
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="codigo"
                                    type="text"
                                    placeholder="Ubix-123"
                                    value={formik.values.codigo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.codigo && formik.errors.codigo && (
                                    <div
                                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                        role="alert"
                                    >
                                        {/* <p className="font-bold">Error:</p> */}
                                        <span>{formik.errors.codigo}</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Contador
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="contador"
                                    type="number"
                                    placeholder=""
                                    step="1"
                                    min="0"
                                    // max="100"
                                    value={formik.values.contador}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.contador &&
                                    formik.errors.contador && (
                                        <div
                                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                            role="alert"
                                        >
                                            {/* <p className="font-bold">Error:</p> */}
                                            <span>
                                                {formik.errors.contador}
                                            </span>
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Por porcentaje (%)
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="porcentaje"
                                    type="number"
                                    placeholder=""
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={formik.values.porcentaje}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.porcentaje &&
                                    formik.errors.porcentaje && (
                                        <div
                                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                            role="alert"
                                        >
                                            {/* <p className="font-bold">Error:</p> */}
                                            <p>{formik.errors.porcentaje}</p>
                                        </div>
                                    )}
                            </div>

                            <div className="flex flex-col">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Por valor
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="valor"
                                    type="number"
                                    placeholder=""
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={formik.values.valor}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.valor && formik.errors.valor && (
                                    <div
                                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                        role="alert"
                                    >
                                        {/* <p className="font-bold">Error:</p> */}
                                        <p>{formik.errors.valor}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
                            <button
                                type="submit"
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Actualizar promoción
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditarPromocion;
