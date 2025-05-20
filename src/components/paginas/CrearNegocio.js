import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";

import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext"; // Cambiar nombre
import { GeoFirestore } from "geofirestore";

const CrearNegocio = () => {
    // State para las imagenes de negocio
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlimagen] = useState("");
    const [categorias, setCategorias] = useState([]);

    const { firebase } = useContext(FirebaseContext);
    const { negocioseleccionado } = useContext(PedidoContext);

    const geofirestore = new GeoFirestore(firebase.db);
    const geocollection = geofirestore.collection("restaurantes");

    useEffect(() => {
        if (negocioseleccionado) {
            // Guarda el id del conductor en la localStorage
            localStorage.setItem("idnegocio", negocioseleccionado.id);
            localStorage.setItem("nombrenegocio", negocioseleccionado.nombre);

            console.log("ID NEGOCIO", negocioseleccionado.id);
            const unsubscribe = firebase.db
                .collection("categorias")
                .doc(negocioseleccionado.id)
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
    }, [firebase.db, negocioseleccionado]); // firebase.db

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
        initialValues: {
            nombre: "",

            categorias: "",
            descripcion: "",
            imagen: "",
            // tasa: "",
            email: "",
            password: "",
            confirmPassword: "",
            codigores: "",
            latitude: "",
            longitude: "",
            apertura: "",
            cierre: "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required("El nombre es obligatorio")
                .min(3, "El nombre debe tener al menos 3 caracteres"),

            categorias: Yup.string().required("La categoría es obligatoria"),
            descripcion: Yup.string()
                .required("La descripción es obligatoria")
                .min(10, "La descripción debe tener al menos 10 caracteres"),
            apertura: Yup.string().required(
                "El horario de apertura es obligatorio"
            ),
            cierre: Yup.string().required(
                "El horario de cierre es obligatorio"
            ),
            // tasa: Yup.number()
            //   .required("La tasa de dolar es obligatoria")
            //   .min(3, "La tasa es a partir de 4 BsS"),
            email: Yup.string()
                .email("Verifique que sea un email válido")
                .required("El email es obligatorio")
                .min(14, "El email no válido "),
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
            codigores: Yup.string().required("El código es requerido"),
            latitude: Yup.number()
                // .min(1, "Solo puedes agregar un precio")
                .required("La latitud es obligatoria"),
            longitude: Yup.number()
                // .min(-1, "Solo puedes agregar un precio")
                .required("La longitud es obligatoria"),
        }),
        onSubmit: (restaurante) => {
            try {
                crearRestaurante(restaurante);
            } catch (error) {
                console.log(error);
            }
        },
    });

    // Mejorar la promesa
    const crearRestaurante = async (restaurante) => {
        let collectionRef = firebase.db.collection("restaurantes");
        firebase.auth
            .createUserWithEmailAndPassword(
                restaurante.email,
                restaurante.password
            )
            .then((data) => {
                restaurante.abierto = true;
                restaurante.imagen = urlimagen;
                restaurante.descuentoGeneral = 0;

                restaurante.negocioTipo = negocioseleccionado
                    ? negocioseleccionado.nombre
                    : localStorage.getItem("nombrenegocio");

                restaurante.negocioId = negocioseleccionado
                    ? negocioseleccionado.id
                    : localStorage.getItem("idnegocio");

                // Datos ya registrados por auth entonces se agregan a firestore
                collectionRef.doc(data.user.uid).set({
                    ...restaurante,
                });

                geocollection.doc(data.user.uid).update({
                    // El campo de coordenadas debe ser un GeoPoint
                    coordinates: new firebase.fire.GeoPoint(
                        restaurante.latitude,
                        restaurante.longitude
                    ),
                });

                // Redireccionar
                navigate("/"); // negocios
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
            .ref("negocios")
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
                                <h1 className="text-gray-700 font-bold md:text-2xl text-xl pt-10">
                                    Agregar negocio (
                                    {negocioseleccionado
                                        ? negocioseleccionado.nombre
                                        : localStorage.getItem("nombrenegocio")}
                                    )
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
                                id="codigores"
                                type="text"
                                placeholder="Código"
                                value={formik.values.codigores}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.codigores && formik.errors.codigores && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.codigores}</p>
                            </div>
                        )}

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
                                Categoria
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
                                Agregar negocio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CrearNegocio;
