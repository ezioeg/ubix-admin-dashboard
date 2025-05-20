import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileUploader from "react-firebase-file-uploader";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext";
import { GeoFirestore } from "geofirestore";

const EditarConductor = () => {
    // State para las imagenes de conductor
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlimagen] = useState("");
    const [conductorInfo, setConductorInfo] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    // Para acceder a los datos del conductor a editar
    const { conductorseleccionado } = useContext(PedidoContext);

    const geofirestore = new GeoFirestore(firebase.db);
    const geocollection = geofirestore.collection("conductores");

    useEffect(() => {
        if (conductorseleccionado) {
            // Guarda el id del conductor en la localStorage
            localStorage.setItem("idconductor", conductorseleccionado.id);

            const unsubscribe = firebase.db
                .collection("conductores")
                .doc(conductorseleccionado.id)
                .onSnapshot(function (doc) {
                    const conductor = {
                        id: doc.id,
                        ...doc.data(),
                    };
                    console.log(conductor);
                    setConductorInfo(conductor);
                });

            return () => {
                // Unmouting
                unsubscribe();
            };
        } else {
            // Usa el id guardado en localStorage
            const unsubscribe = firebase.db
                .collection("conductores")
                .doc(localStorage.getItem("idconductor"))
                .onSnapshot(function (doc) {
                    const conductor = {
                        id: doc.id,
                        ...doc.data(),
                    };
                    console.log(conductor);
                    setConductorInfo(conductor);
                });

            return () => {
                // Unmouting
                unsubscribe();
            };
        }
    }, [firebase.db, conductorseleccionado]); // firebase.db, conductorseleccionado

    //Hook para redireccionar
    const navigate = useNavigate();

    // Validacion y leer los datos del formulario
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            nombre:
                !!conductorInfo && !!conductorInfo.nombre
                    ? conductorInfo.nombre
                    : "",
            cedula:
                !!conductorInfo && !!conductorInfo.cedula
                    ? conductorInfo.cedula
                    : "",
            celular:
                !!conductorInfo && !!conductorInfo.celular
                    ? conductorInfo.celular
                    : "",
            imagen:
                !!conductorInfo && !!conductorInfo.imagen
                    ? conductorInfo.imagen
                    : "",
            placa:
                !!conductorInfo && !!conductorInfo.placa
                    ? conductorInfo.placa
                    : "",
            latitude:
                !!conductorInfo && !!conductorInfo.coordinates
                    ? conductorInfo.coordinates.latitude
                    : "",
            longitude:
                !!conductorInfo && !!conductorInfo.coordinates
                    ? conductorInfo.coordinates.longitude
                    : "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required("El nombre es obligatorio")
                .min(3, "El nombre debe tener al menos 3 caracteres"),
            cedula: Yup.string()
                .required("La cedula es obligatorio")
                .min(7, "La cedula debe tener al menos 7 caracteres"),
            celular: Yup.number().required("El celular es obligatorio"),
            placa: Yup.string().required("La placa es obligatoria"),
            latitude: Yup.number()
                //   // .min(1, "Solo puedes agregar un precio")
                .required("La latitud es obligatoria"),
            longitude: Yup.number()
                //   // .min(-1, "Solo puedes agregar un precio")
                .required("La longitud es obligatoria"),
        }),
        onSubmit: (conductor) => {
            let collectionRef = firebase.db.collection("conductores");

            try {
                // si se edita la imagen entonces sube el nuevo urlimagen sino deja el urlimagen anterior
                conductor.imagen = urlimagen ? urlimagen : conductorInfo.imagen;

                if (urlimagen) {
                    // Elimina la imagen anterior en el storage
                    let imageRef = firebase.storage.refFromURL(
                        conductorInfo.imagen
                    );

                    imageRef.delete();
                    conductor.imagen = urlimagen;
                } else {
                    conductor.imagen = conductorInfo.imagen;
                }

                // Mejorar estado global conductorInfo
                collectionRef
                    .doc(conductorInfo.id) // const id = conductorseleccionado ? conductorseleccionado.id : localStorage.getItem("idconductor");
                    .update(conductor);

                geocollection.doc(conductorInfo.id).update({
                    // El campo de coordenadas debe ser un GeoPoint
                    coordinates: new firebase.fire.GeoPoint(
                        conductor.latitude,
                        conductor.longitude
                    ),
                });

                // Redireccionar
                navigate("/conductores"); // conductores
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
            .ref("conductores")
            .child(nombreArchivo)
            .getDownloadURL();
        // console.log(url);
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
                                    className="rounded-md h-24 w-24 shadow-xl"
                                    src={formik.values.imagen}
                                    // width="200"
                                    alt="imagen conductor"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="flex">
                                <h1 className="text-gray-700 font-bold md:text-2xl text-xl pb-4">
                                    Actualizar conductor
                                </h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold mb-1">
                                Foto
                            </label>
                            <div className="flex w-full">
                                <FileUploader
                                    accept="image/*"
                                    id="imagen"
                                    name="imagen"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref(
                                        "conductores"
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
                                placeholder="Nombre completo"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Cedula
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="cedula"
                                    type="number"
                                    // step="0.01"
                                    min="0"
                                    // max="30"
                                    placeholder="7305587"
                                    value={formik.values.cedula}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.cedula && formik.errors.cedula && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.cedula}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Celular
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="celular"
                                    type="number"
                                    // step="0.01"
                                    min="0"
                                    // max="30"
                                    placeholder="4165768723"
                                    value={formik.values.celular}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.celular && formik.errors.celular && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.celular}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Placa
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="placa"
                                type="text"
                                placeholder="placa de vehiculo"
                                value={formik.values.placa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.placa && formik.errors.placa && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.placa}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Latitud (Para prueba)
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
                                    Longitud (Para prueba)
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
                                onClick={() => {
                                    navigate("/conductores");
                                }}
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Atras
                            </button>
                            <button
                                type="submit"
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Actualizar conductor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditarConductor;
