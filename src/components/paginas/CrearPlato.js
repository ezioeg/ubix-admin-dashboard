import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileUploader from "react-firebase-file-uploader";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FirebaseContext } from "../../firebase"; //index
import PedidoContext from "../../context/pedidos/pedidosContext";

const CrearPlato = () => {
    // State para las imagenes de platos
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlimagen] = useState("");
    const [categorias, setCategorias] = useState([]);

    const [ingredientes, setIngredientes] = useState([]);

    const [ingredienteNombreInputValue, setIngredienteNombreInputValue] =
        useState("");
    const [ingredientePrecioInputValue, setIngredientePrecioInputValue] =
        useState(0);
    // const [totalItemCount, setTotalItemCount] = useState(6);

    const { firebase } = useContext(FirebaseContext);

    // Para acceder a los datos del negocio a editar
    const { restauranteseleccionado } = useContext(PedidoContext);

    useEffect(() => {
        if (restauranteseleccionado) {
            // Guarda el id del plato en la localStorage
            localStorage.setItem("idrestaurante", restauranteseleccionado.id);
            localStorage.setItem(
                "idnegocio",
                restauranteseleccionado.negocioId
            );

            const unsubscribe = firebase.db
                .collection("categorias")
                .doc(restauranteseleccionado.negocioId)
                .collection("secundarias")
                .onSnapshot(manejarSnapshot);

            return () => {
                // Unmouting
                unsubscribe();
            };
        } else {
            const unsubscribe = firebase.db
                .collection("categorias")
                .doc(localStorage.getItem("idnegocio"))
                .collection("secundarias")
                .onSnapshot(manejarSnapshot);

            return () => {
                // Unmouting
                unsubscribe();
            };
        }
    }, [firebase.db, restauranteseleccionado]); // restauranteseleccionado

    function manejarSnapshot(snapshot) {
        const categorias = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });

        console.log(categorias);
        setCategorias(categorias);
    }

    //Hook para redireccionar
    const navigate = useNavigate();

    // Validacion y leer los datos del formulario
    const formik = useFormik({
        initialValues: {
            nombre: "",
            precio: "",
            categoria: "",
            imagen: "",
            descripcion: "",
            descuentoPorcentaje: 0,
            limiteCompra: 0,
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(3, "El nombre debe tener al menos 3 caracteres")
                .required("El nombre es obligatorio"),
            precio: Yup.number()
                .min(0.1, "Tienes que agregar un precio positivo")
                .required("El precio es obligatorio"),
            categoria: Yup.string().required("La categoría es obligatoria"),
            descripcion: Yup.string()
                .min(10, "La descripción debe tener al menos 10 caracteres")
                .required("La descripción es obligatoria"),
            descuentoPorcentaje: Yup.number()
                .min(0, "El mínimo es 0")
                .max(99, "El máximo es 99")
                .required("Coloque 0 si no desea descuento en este producto"),
            limiteCompra: Yup.number()
                .min(0, "Tiene que ser nulo o positivo")
                .required("El limite de compra es obligatorio"),
        }),
        onSubmit: (plato) => {
            try {
                const id = restauranteseleccionado
                    ? restauranteseleccionado.id
                    : localStorage.getItem("idrestaurante");

                plato.existencia = true;
                plato.imagen = urlimagen;
                plato.ingredientes = ingredientes; //arreglo de objetos
                // Revizar que el producto este guardando el id del negocio
                plato.restauranteId = id;
                firebase.db
                    .collection("restaurantes")
                    .doc(id)
                    .collection("productos")
                    .add(plato);

                // Redireccionar
                navigate("/menu");
            } catch (error) {
                console.log(error);
            }
        },
    });

    // Acciones sobre el proceso de la imagen
    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    };

    const handleUploadError = (error) => {
        setSubiendo(false);
        console.log(error);
    };

    // Si es upload success, busca la url por referencia y la guarda en un estado
    const handleUploadSuccess = async (nombre) => {
        setProgreso(100);
        setSubiendo(false);

        const url = await firebase.storage
            .ref(`negocios/${localStorage.getItem("idrestaurante")}/productos/`)
            .child(nombre)
            .getDownloadURL();
        console.log(url);
        setUrlimagen(url);
    };

    const handleProgress = (progreso) => {
        setProgreso(progreso);
        console.log(progreso);
    };

    const eliminarIngrediente = (position) => {
        let listaActualizadaIngredientes = [
            ...ingredientes.slice(0, position),
            ...ingredientes.slice(position + 1),
        ];

        setIngredientes(listaActualizadaIngredientes);
    };

    const agregarIngrediente = () => {
        const nuevoIngrediente = {
            nombre: ingredienteNombreInputValue,
            precio: Number.parseFloat(ingredientePrecioInputValue),
            esObligatorio: false,
            seleccionado: false,
        };

        const listaActualizadaIngredientes = [
            ...ingredientes,
            nuevoIngrediente,
        ];

        setIngredientes(listaActualizadaIngredientes);
        setIngredienteNombreInputValue("");
        setIngredientePrecioInputValue(0);
        // calculateTotal();
    };

    const toggleRequired = (index) => {
        const listaActualizadaIngredientes = [...ingredientes];

        listaActualizadaIngredientes[index].esObligatorio =
            !listaActualizadaIngredientes[index].esObligatorio;

        setIngredientes(listaActualizadaIngredientes);
        console.log(listaActualizadaIngredientes);
    };

    // const incrementarCantidad = (index) => {
    //     const listaActualizadaIngredientes = [...ingredientes];

    //     listaActualizadaIngredientes[index].quantity++;

    //     setIngredientes(listaActualizadaIngredientes);
    //     calculateTotal();
    // };

    // const decrementarCantidad = (index) => {
    //     const listaActualizadaIngredientes = [...ingredientes];

    //     listaActualizadaIngredientes[index].quantity--;

    //     setIngredientes(listaActualizadaIngredientes);
    //     calculateTotal();
    // };

    // const calculateTotal = () => {
    //     const totalItemCount = ingredientes.reduce((total, item) => {
    //         return total + item.precio;
    //     }, 0);

    //     setTotalItemCount(totalItemCount);
    // };

    return (
        <>
            <div className="flex h-full bg-gray-200 items-center justify-center">
                <div className="grid bg-white rounded-lg shadow-xl w-11/12 md:w-9/12 lg:w-1/2 px-10">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex justify-center">
                            <div className="flex">
                                <h1 className="text-gray-700 font-bold md:text-2xl text-xl pt-10 pb-4">
                                    Agregar plato
                                </h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold mb-1">
                                Imagen
                            </label>
                            <div className="flex w-full ">
                                {/* Se almacena la imagen apenas se monta */}
                                <FileUploader
                                    accept="image/*"
                                    id="imagen"
                                    nombre="imagen"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref(
                                        `negocios/${localStorage.getItem(
                                            "idrestaurante"
                                        )}/productos/`
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
                                placeholder="Nombre plato"
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
                                    Precio
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="precio"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="5000"
                                    placeholder="$20"
                                    value={formik.values.precio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.precio && formik.errors.precio && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.precio}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Descuento (%)
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="descuentoPorcentaje"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="99"
                                    placeholder="0"
                                    value={formik.values.descuentoPorcentaje}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.descuentoPorcentaje &&
                                formik.errors.descuentoPorcentaje && (
                                    <div
                                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                        role="alert"
                                    >
                                        {/* <p className="font-bold">Error:</p> */}
                                        <p>
                                            {formik.errors.descuentoPorcentaje}
                                        </p>
                                    </div>
                                )}
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Limite de compra
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="limiteCompra"
                                type="number"
                                min="0"
                                placeholder=""
                                value={formik.values.limiteCompra}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.limiteCompra &&
                            formik.errors.limiteCompra && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.limiteCompra}</p>
                                </div>
                            )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Categoría
                            </label>
                            <select
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="categoria"
                                value={formik.values.categoria}
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
                        {formik.touched.categoria &&
                            formik.errors.categoria && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.categoria}</p>
                                </div>
                            )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Descripción
                            </label>
                            <textarea
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="descripcion"
                                placeholder="Descripción Plato"
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

                        {/* Ingredientes */}
                        <div className="grid grid-cols-1 mt-5 mx-7 ">
                            <div className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold py-2 px-2">
                                Ingredientes
                            </div>
                            <div className=" md:text-sm text-xs text-gray-700 text-light font-semibold px-2">
                                (Coloque check a los ingredientes obligatorios)
                            </div>
                            <div className="grid grid-cols-1 bg-gray-200 rounded-md p-3">
                                <div className="flex space-x-1">
                                    <input
                                        value={ingredienteNombreInputValue}
                                        onChange={(event) =>
                                            setIngredienteNombreInputValue(
                                                event.target.value
                                            )
                                        }
                                        className="w-full py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                        id="ingrediente-nombre"
                                        type="text"
                                        placeholder="Ingrediente"
                                    />
                                    <input
                                        value={ingredientePrecioInputValue}
                                        onChange={(event) =>
                                            setIngredientePrecioInputValue(
                                                event.target.value
                                            )
                                        }
                                        className="w-full py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                        id="ingrediente-precio"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        placeholder="Precio"
                                    />
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            className="font-bold flex justify-center items-center h-8 w-8 border-orange-600 border-2 text-orange-600 rounded-full transition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"
                                            onClick={() => agregarIngrediente()}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-200 p-3">
                                {ingredientes.map((ingrediente, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between border-b border-t"
                                    >
                                        <label className="mx-2 flex justify-center">
                                            <input
                                                className="bg-red-500 w-4 h-4 mr-2 rounded-xl"
                                                type="checkbox"
                                                checked={
                                                    ingrediente.esObligatorio ||
                                                    ""
                                                }
                                                onChange={() =>
                                                    toggleRequired(index)
                                                }
                                            />
                                            <div className=" text-gray-700">
                                                {ingrediente.nombre} -
                                            </div>
                                            <div className="text-gray-700">
                                                {ingrediente.precio}$
                                            </div>
                                        </label>
                                        <div className="flex items-center">
                                            <button
                                                type="button"
                                                className=" px-3 font-bold text-sm border-red-600  text-red-600 transition duration-300 hover:bg-red-600 hover:text-white focus:outline-none"
                                                onClick={() => {
                                                    eliminarIngrediente(index);
                                                }}
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-center md:gap-8 gap-4 pt-5 pb-5">
                            <button
                                type="submit"
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Agregar plato
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CrearPlato;
