import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileUploader from "react-firebase-file-uploader";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext";
import { GeoFirestore } from "geofirestore";

const EditarNegocio = () => {
    // State para las imagenes de negocio
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlimagen] = useState("");
    const [restauranteInfo, setRestauranteInfo] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    // Para acceder a los datos del negocio a editar
    const { restauranteseleccionado } = useContext(PedidoContext);

    const geofirestore = new GeoFirestore(firebase.db);
    const geocollection = geofirestore.collection("restaurantes");

    useEffect(() => {
        if (restauranteseleccionado) {
            // Guarda el id del negocio en la localStorage
            localStorage.setItem("idrestaurante", restauranteseleccionado.id);

            const unsubscribe = firebase.db
                .collection("restaurantes")
                .doc(restauranteseleccionado.id)
                .onSnapshot(function (doc) {
                    const restaurante = {
                        id: doc.id,
                        ...doc.data(),
                    };
                    console.log(restaurante);
                    setRestauranteInfo(restaurante);
                });

            return () => {
                // Unmouting
                unsubscribe();
            };
        } else {
            // Usa el id guardado en localStorage
            const unsubscribe = firebase.db
                .collection("restaurantes")
                .doc(localStorage.getItem("idrestaurante"))
                .onSnapshot(function (doc) {
                    const restaurante = {
                        id: doc.id,
                        ...doc.data(),
                    };
                    console.log(restaurante);
                    setRestauranteInfo(restaurante);
                });

            return () => {
                // Unmouting
                unsubscribe();
            };
        }
    }, [firebase.db, restauranteseleccionado]); // firebase.db, restauranteseleccionado

    useEffect(() => {
        if (restauranteseleccionado) {
            localStorage.setItem(
                "idnegocio",
                restauranteseleccionado.negocioId
            );
            localStorage.setItem(
                "nombrenegocio",
                restauranteseleccionado.negocioTipo
            );

            const unsubscribe = firebase.db
                .collection("categorias")
                .doc(restauranteseleccionado.negocioId)
                .collection("principales")
                .onSnapshot(manejarSnapshot);

            return () => {
                // Unmouting
                unsubscribe();
            };
        } else {
            const unsubscribe = firebase.db
                .collection("categorias")
                .doc(localStorage.getItem("idnegocio"))
                .collection("principales")
                .onSnapshot(manejarSnapshot);

            return () => {
                // Unmouting
                unsubscribe();
            };
        }
    }, [firebase.db, restauranteseleccionado]); // firebase.db

    function manejarSnapshot(snapshot) {
        const categorias = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });

        // almacenar los categorias en el estado

        console.log(categorias);
        setCategorias(categorias);
    }

    //Hook para redireccionar
    const navigate = useNavigate();

    // Validacion y leer los datos del formulario
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            nombre:
                !!restauranteInfo && !!restauranteInfo.nombre
                    ? restauranteInfo.nombre
                    : "",
            categorias:
                !!restauranteInfo && !!restauranteInfo.categorias
                    ? restauranteInfo.categorias
                    : "",
            descripcion:
                !!restauranteInfo && !!restauranteInfo.descripcion
                    ? restauranteInfo.descripcion
                    : "",
            imagen:
                !!restauranteInfo && !!restauranteInfo.imagen
                    ? restauranteInfo.imagen
                    : "",
            // tasa:
            //   !!restauranteInfo && !!restauranteInfo.tasa ? restauranteInfo.tasa : "",
            latitude:
                !!restauranteInfo && !!restauranteInfo.coordinates
                    ? restauranteInfo.coordinates.latitude
                    : "",
            longitude:
                !!restauranteInfo && !!restauranteInfo.coordinates
                    ? restauranteInfo.coordinates.longitude
                    : "",
            descuentoGeneral:
                !!restauranteInfo && !!restauranteInfo.descuentoGeneral
                    ? restauranteInfo.descuentoGeneral
                    : 0,
            apertura:
                !!restauranteInfo && !!restauranteInfo.apertura
                    ? restauranteInfo.apertura
                    : "",
            cierre:
                !!restauranteInfo && !!restauranteInfo.cierre
                    ? restauranteInfo.cierre
                    : "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(3, "El nombre debe tener al menos 3 caracteres")
                .required("El nombre es obligatorio"),
            categorias: Yup.string().required("La categoría es obligatoria"),
            descripcion: Yup.string()
                .min(10, "La descripción debe tener al menos 10 caracteres")
                .required("La descripción es obligatoria"),
            // tasa: Yup.number()
            //   .min(4, "La tasa es a partir de 4 BsS")
            //   .required("La tasa de dolar es obligatoria"),
            latitude: Yup.number()
                // .min(1, "Solo puedes agregar un precio")
                .required("La latitud es obligatoria"),
            longitude: Yup.number()
                // .min(-1, "Solo puedes agregar un precio")
                .required("La longitud es obligatoria"),
            descuentoGeneral: Yup.number()
                .min(0, "El mínimo es 0")
                .max(99, "El máximo es 99")
                .required("Coloque 0 si no desea hacer un descuento general"),
            apertura: Yup.string().required(
                "El horario de apertura es obligatorio"
            ),
            cierre: Yup.string().required(
                "El horario de cierre es obligatorio"
            ),
        }),
        onSubmit: (restaurante) => {
            try {
                let collectionRef = firebase.db.collection("restaurantes");

                // Mejorar estado global restauranteInfo
                // Modifica el descuento general
                collectionRef
                    .doc(restauranteInfo.id)
                    .update({ descuentoGeneral: restaurante.descuentoGeneral });

                // Modifica el descuento en todos los productos
                collectionRef
                    .doc(restauranteInfo.id)
                    .collection("productos")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            doc.ref.update({
                                descuentoPorcentaje:
                                    restaurante.descuentoGeneral,
                            });
                        });
                    });

                // si se edita la imagen entonces sube el nuevo urlimagen sino deja el urlimagen anterior

                if (urlimagen) {
                    // Elimina la imagen anterior en el storage
                    let imageRef = firebase.storage.refFromURL(
                        restauranteInfo.imagen
                    );
                    imageRef.delete();
                    restaurante.imagen = urlimagen;
                } else {
                    restaurante.imagen = restauranteInfo.imagen;
                }

                collectionRef
                    .doc(restauranteInfo.id) // const id = restauranteseleccionado ? restauranteseleccionado.id : localStorage.getItem("idrestaurante");
                    .update(restaurante);

                geocollection.doc(restauranteInfo.id).update({
                    // El campo de coordenadas debe ser un GeoPoint
                    coordinates: new firebase.fire.GeoPoint(
                        restaurante.latitude,
                        restaurante.longitude
                    ),
                });

                // Redireccionar
                navigate("/"); // negocios
            } catch (error) {
                console.log(error);
            }
        },
    });

    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    };

    const handleUploadError = (error) => {
        setSubiendo(false);
        console.log(error);
    };

    const handleUploadSuccess = async (nombreArchivo) => {
        setProgreso(100);
        setSubiendo(false);

        // Se obtiene y se almacena la URL de destino
        const url = await firebase.storage
            .ref("negocios")
            .child(nombreArchivo)
            .getDownloadURL();
        console.log(url);
        setUrlimagen(url);
    };

    const handleProgress = (progreso) => {
        setProgreso(progreso);
        console.log(progreso);
    };

    return (
        <>
            <div className="flex h-full bg-gray-200 items-center justify-center">
                <div className="grid bg-white rounded-lg shadow-xl w-11/12 md:w-9/12 lg:w-1/2 px-10">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex justify-center py-4">
                            <div className="flex bg-orange-600 rounded-full md:p-6 p-6 border-2 border-orange-600">
                                <img
                                    // className="md:object-fill "
                                    className="bg-white rounded-md h-24 w-24 shadow-xl"
                                    src={formik.values.imagen}
                                    // width="200"
                                    alt="imagen negocio"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="flex">
                                <h1 className="text-gray-700 font-bold md:text-2xl text-xl">
                                    Actualizar negocio (
                                    {restauranteseleccionado
                                        ? restauranteseleccionado.negocioTipo
                                        : localStorage.getItem("nombrenegocio")}
                                    )
                                </h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Hora de apertura
                                </label>
                                <select
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="apertura"
                                    value={formik.values.apertura}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">--Seleccione--</option>
                                    <option value="9:00">9:00 am</option>
                                    <option value="9:30">9:30 am</option>
                                    <option value="10:00">10:00 am</option>
                                    <option value="10:30">10:30 am</option>
                                    <option value="11:00">11:00 am</option>
                                    <option value="11:30">11:30 am</option>
                                    <option value="12:00">12:00 pm</option>
                                    <option value="12:30">12:30 pm</option>
                                    <option value="13:00">01:00 pm</option>
                                    <option value="13:30">01:30 pm</option>
                                    <option value="14:00">02:00 pm</option>
                                    <option value="14:30">02:30 pm</option>
                                    <option value="15:00">03:00 pm</option>
                                </select>
                            </div>
                            {formik.touched.apertura && formik.errors.apertura && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.apertura}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Hora de cierre
                                </label>
                                <select
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="cierre"
                                    value={formik.values.cierre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">--Seleccione--</option>
                                    <option value="14:00">02:00 pm</option>
                                    <option value="14:30">02:30 pm</option>
                                    <option value="15:00">03:00 pm</option>
                                    <option value="15:30">03:30 pm</option>
                                    <option value="16:00">04:00 pm</option>
                                    <option value="16:30">04:30 pm</option>
                                    <option value="17:00">05:00 pm</option>
                                    <option value="17:30">05:30 pm</option>
                                    <option value="18:00">06:00 pm</option>
                                    <option value="18:30">06:30 pm</option>
                                    <option value="19:00">07:00 pm</option>
                                    <option value="19:30">07:30 pm</option>
                                    <option value="20:00">08:00 pm</option>
                                </select>
                            </div>
                            {formik.touched.cierre && formik.errors.cierre && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.cierre}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold mb-1">
                                Imagen
                            </label>
                            <div className="flex w-full ">
                                <FileUploader
                                    accept="image/*"
                                    id="imagen"
                                    name="imagen"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref(
                                        "negocios"
                                    )}
                                    onUploadStart={handleUploadStart}
                                    onUploadError={handleUploadError}
                                    onUploadSuccess={handleUploadSuccess}
                                    onProgress={handleProgress}
                                />
                            </div>
                            {subiendo && (
                                <div className="h-12 relative w-full border my-5">
                                    <div
                                        className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                                        style={{ width: `${progreso}%` }}
                                    >
                                        {progreso} %
                                    </div>
                                </div>
                            )}

                            {urlimagen && (
                                <p className="bg-green-500 text-white p-3 text-center my-5">
                                    La imagen se subio correctamente
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Nombre
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="nombre"
                                type="text"
                                placeholder="Nombre negocio"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.nombre}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Categoría
                            </label>
                            <select
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="categorias"
                                value={formik.values.categorias}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">--Seleccione--</option>
                                {categorias
                                    .sort(function (a, b) {
                                        // Ordena por nombre
                                        return a.nombre.localeCompare(b.nombre);
                                    })
                                    .map((categoria) => (
                                        <option
                                            key={categoria.id}
                                            value={categoria.nombre}
                                        >
                                            {categoria.nombre}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        {formik.touched.categorias && formik.errors.categorias && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.categorias}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Descripción
                            </label>
                            <textarea
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="descripcion"
                                placeholder="Descripción Negocio"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></textarea>
                        </div>
                        {formik.touched.descripcion &&
                            formik.errors.descripcion && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.descripcion}</p>
                                </div>
                            )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Descuento General (%)
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="descuentoGeneral"
                                type="number"
                                step="0.01"
                                min="0"
                                max="99"
                                placeholder="0"
                                value={formik.values.descuentoGeneral}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.descuentoGeneral &&
                            formik.errors.descuentoGeneral && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.descuentoGeneral}</p>
                                </div>
                            )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Latitud
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="latitude"
                                    type="number"
                                    // step="0.01"
                                    // min="0"
                                    // max="30"
                                    placeholder="10"
                                    value={formik.values.latitude}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.latitude && formik.errors.latitude && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.latitude}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Longitud
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="longitude"
                                    type="number"
                                    // step="0.01"
                                    // min="0"
                                    // max="30"
                                    placeholder="-66"
                                    value={formik.values.longitude}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.longitude &&
                                formik.errors.longitude && (
                                    <div
                                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                        role="alert"
                                    >
                                        {/* <p className="font-bold">Error:</p> */}
                                        <p>{formik.errors.longitude}</p>
                                    </div>
                                )}
                        </div>

                        <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
                            <button
                                type="submit"
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Actualizar negocio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditarNegocio;
