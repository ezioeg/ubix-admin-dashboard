import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase"; //index

// Para los Modales
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show] = useState(true);

  const [visibleModalError, setVisibleModalError] = useState(false);

  const { firebase } = useContext(FirebaseContext);

  // Validacion y leer los datos del formulario
  const formik = useFormik({
    initialValues: {
      nombre: "",
      contrasena: "",
      codigo: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        // .min(10, "Debe tener al menos 10 caracteres")
        .required("El admin user es requerido"),
      contrasena: Yup.string()
        // .min(6, "La contrasena debe tener al menos 6 caracteres")
        .required("La contraseña es requerida"),
      codigo: Yup.string().required("El código es requerido"),
    }),
    onSubmit: (datos) => {
      try {
        signInRestaurant(datos.nombre, datos.contrasena, datos.codigo);
      } catch (error) {
        console.log(error); //Email o contraseña incorrecta
      }
    },
  });

  const signInRestaurant = async (email, password, codigo) => {
    setLoading(true);

    // Verifica el codigo del admin
    await firebase.db
      .collection("admin")
      .where("codigoadm", "==", codigo)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
          // console.log(doc.id, ' => ', doc.data().codigo);
          await firebase.auth
            .signInWithEmailAndPassword(email, password)
            .catch(() => showModalError());
        });
      })
      .catch(() => {
        setError("Código no valido");
      });

    setLoading(false);
  };

  function showModalError() {
    setVisibleModalError(true);
  }

  function hideModalError() {
    setVisibleModalError(false);
  }

  return (
    <>
      <div className="flex h-screen bg-gray-200 items-center justify-center">
        <div className="grid bg-white rounded-lg shadow-xl w-11/12 md:w-9/12 lg:w-1/2 px-10">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-center py-4">
              <div className="flex bg-gray-700 rounded-full md:p-4 p-2 border-2 border-gray-700">
                <img
                  className="md:object-fill "
                  src={require("../../assets/favicon.ico")}
                  // width="200"
                  alt=""
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex">
                <h1 className="text-gray-700 font-bold md:text-2xl text-xl uppercase">
                  Iniciar sesión
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 mt-5 mx-7">
              <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                Admin User
              </label>
              <input
                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                id="nombre"
                type="text"
                placeholder="Admin User"
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
                Contraseña
              </label>
              <input
                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                id="contrasena"
                type={show ? "password" : "text"}
                placeholder="Contraseña"
                value={formik.values.contrasena}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.contrasena && formik.errors.contrasena && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                role="alert"
              >
                {/* <p className="font-bold">Error:</p> */}
                <p>{formik.errors.contrasena}</p>
              </div>
            )}

            <div className="grid grid-cols-1 mt-5 mx-7">
              <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                Código
              </label>
              <input
                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                id="codigo"
                type="text"
                placeholder="Código"
                value={formik.values.codigo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.codigo && formik.errors.codigo && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                role="alert"
              >
                {/* <p className="font-bold">Error:</p> */}
                <p>{formik.errors.codigo}</p>
              </div>
            )}

            {error && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                role="alert"
              >
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
              <button
                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                type="submit"
              >
                Iniciar
              </button>
            </div>

            {loading && (
              <p className="flex justify-center pb-10 text-gray-800 font-bold">
                Cargando...
              </p>
            )}

            {/* Modales */}
            <div>
              <Rodal
                visible={visibleModalError}
                onClose={() => hideModalError()}
                width={300}
                height={150}
              >
                <p className="block text-white bg-gray-800 font-bold mt-5text-center">
                  Error de validación
                </p>
                <p className="block text-gray-800 font-bold mt-5 text-center">
                  Email o contraseña incorrecta
                </p>
              </Rodal>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
