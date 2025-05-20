import React from "react";

// Para los Modales
// import Rodal from "rodal";
import "rodal/lib/rodal.css";

const OrdenConductor = ({ orden }) => {
  //   function showModalEliminar() {
  //     setVisibleModalEliminar(true);
  //   }

  //   function hideModalEliminar() {
  //     setVisibleModalEliminar(false);
  //   }

  //   const ConfirmarEliminarOrden = async (id) => {
  //     try {
  //       await firebase.db
  //         .collection("clientes")
  //         .doc(orden.clienteId)
  //         .collection("ordenes")
  //         .doc(id)
  //         .delete();

  //       await firebase.db
  //         .collection("restaurantes")
  //         .doc(orden.restauranteId)
  //         .collection("ordenes")
  //         .doc(id)
  //         .delete();

  //       await firebase.db
  //         .collection("conductores")
  //         .doc(orden.id)
  //         .collection("notificaciones")
  //         .doc(id)
  //         .delete();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <>
      {/* <div>
        <Rodal
          visible={visibleModalEliminar}
          onClose={() => hideModalEliminar()}
          width={300}
          height={150}
        >
          <h1 className="block text-white bg-gray-800 font-bold mt-5 text-center">
            Desea eliminar ésta orden?
          </h1>
          <div className="text-center">
            <button
              className="bg-orange-800 hover:bg-orange-700 inline-block mt-6 mb-5 h1-2 text-white text-xs uppercase font-bold items-center"
              onClick={() => ConfirmarEliminarOrden(orden.id)}
            >
              {" "}
              Confirmar
            </button>
          </div>
        </Rodal>
      </div> */}
      <tbody className="bg-white">
        <tr>
          <td className="px-6 py-4 whitespace-no-wrap border-b ">
            <div className="flex items-center">
              <div>
                <div className="text-sm leading-5 text-gray-800">
                  {orden.id.substr(15)}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-no-wrap border-b  text-gray-800 text-sm leading-5">
            {new Date(orden.creado).toLocaleDateString("es-ES", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            <h1>{new Date(orden.creado).toLocaleTimeString()}</h1>
          </td>
          <td className="px-6 py-4 whitespace-no-wrap border-b ">
            <div className="text-sm leading-5 text-gray-800">
              <p className="">{orden.clientenombre}</p>
              <p className="">{orden.clientetelefono}</p>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-800  text-sm leading-5">
            <p>{orden.clientedireccion.slice(0, -11)}</p>
          </td>
          <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-800  text-sm leading-5">
            {orden.orden.flatMap((platos, index) => (
              // key={orden.id} o key={index} para eliminar un error de keys
              <p key={index} className="text-gray-800">
                {platos.cantidad} {platos.nombre} ${platos.total.toFixed(2)}
              </p>
            ))}
            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight mt-1">
              <span
                aria-hidden
                className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
              ></span>
              <span className="relative text-xs">
                ${orden.pagototal.toFixed(2)}
              </span>
            </span>
            {orden.cantidadefectivo && (
              <div>
                <p className="block  ">Efectivo</p>

                <p className="">${orden.cantidadefectivo}</p>
              </div>
            )}
          </td>

          {/* {!orden.entregado && (
            <td className="py-4 whitespace-no-wrap text-right border-b  text-sm leading-5">
              <button
                onClick={() => {
                  showModalEliminar();
                }}
                type="submit"
                className="flex px-5 py-2 border-red-600 border text-red-600 rounded transition duration-300 hover:bg-red-600 hover:text-white focus:outline-none"
              >
                Eliminar
              </button>
            </td>
          )} */}
        </tr>
      </tbody>
    </>
  );
};

export default OrdenConductor;
