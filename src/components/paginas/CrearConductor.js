import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";

import { FirebaseContext } from "../../firebase"; //index
import { GeoFirestore } from "geofirestore";

const CrearConductor = () => {
    // State para las imagenes de negocio
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlimagen] = useState("");

    const { firebase } = useContext(FirebaseContext);

    const geofirestore = new GeoFirestore(firebase.db);
    const geocollection = geofirestore.collection("conductores");

    //Hook para redireccionar
    const navigate = useNavigate();

    // Validacion y leer los datos del formulario
    const formik = useFormik({
        initialValues: {
            cedula: "",
            email: "",
            password: "",
            confirmPassword: "",
            nombre: "",
            celular: "",
            imagen: "",
            placa: "",
            codigocon: "",
            latitude: "",
            longitude: "",
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
            email: Yup.string()
                .email("Verifique que sea un email válido")
                .required("El email es obligatorio")
                .min(14, "El email no válido"),
            password: Yup.string()
                .required("La contraseña es obligatoria")
                .min(6, "La contraseña debe ser al menos de 6 caracteres"),
            confirmPassword: Yup.string()
                .required("La confirmación es obligatoria")
                .test(
                    "passwords-match",
                    "Las contraseñas deben coincidir",
                    function (value) {
                        return this.parent.password === value;
                    }
                ),
            codigocon: Yup.string().required("El código es requerido"),
            latitude: Yup.number()
                // .min(1, "Solo puedes agregar un precio")
                .required("La latitud es obligatoria"),
            longitude: Yup.number()
                // .min(-1, "Solo puedes agregar un precio")
                .required("La longitud es obligatoria"),
        }),
        onSubmit: (conductor) => {
            try {
                crearConductor(conductor);
            } catch (error) {
                console.log(error);
            }
        },
    });

    // Mejorar la promesa
    const crearConductor = (conductor) => {
        let collectionRef = firebase.db.collection("conductores");

        firebase.auth
            .createUserWithEmailAndPassword(conductor.email, conductor.password)
            .then((data) => {
                conductor.disponible = true;
                conductor.ordenesPendientes = 0;
                conductor.imagen = urlimagen;

                // Datos ya registrados por auth entonces se agregan a firestore
                collectionRef.doc(data.user.uid).set({
                    ...conductor,
                });

                geocollection.doc(data.user.uid).update({
                    // El campo de coordenadas debe ser un GeoPoint
                    coordinates: new firebase.fire.GeoPoint(
                        conductor.latitude,
                        conductor.longitude
                    ),
                });

                // Redireccionar
                navigate("/conductores"); // conductores
            });
    };

    // Todo sobre las imagenes
    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    };

    const handleUploadError = (error) => {
        setSubiendo(false);
        console.log(error);
    };

    const handleUploadSuccess = async (nombre) => {
        setProgreso(100);
        setSubiendo(false);

        // Almacenar la URL de destino
        const url = await firebase.storage
            .ref("conductores")
            .child(nombre)
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
                        <div className="flex justify-center">
                            <div className="flex">
                                <h1 className="text-gray-700 font-bold md:text-2xl text-xl pt-10 pb-4">
                                    Agregar conductor
                                </h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Email
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="email"
                                type="text"
                                placeholder="johndoe@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.email}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Contraseña
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="password"
                                    type="text"
                                    placeholder="Contraseña"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.password}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="confirmPassword"
                                    type="text"
                                    placeholder="Confirmar Contraseña"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.confirmPassword &&
                                formik.errors.confirmPassword && (
                                    <div
                                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                        role="alert"
                                    >
                                        {/* <p className="font-bold">Error:</p> */}
                                        <p>{formik.errors.confirmPassword}</p>
                                    </div>
                                )}
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Código
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="codigocon"
                                type="text"
                                placeholder="Código"
                                value={formik.values.codigocon}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.codigocon && formik.errors.codigocon && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.codigocon}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold mb-1">
                                Foto
                            </label>
                            <div className="flex w-full ">
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
                                type="submit"
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Agregar conductor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CrearConductor;
