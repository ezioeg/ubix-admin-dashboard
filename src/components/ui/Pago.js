import React, { useState } from "react";

// Para los Modales
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const Pago = ({ orden }) => {
  const [visibleCaptura, setVisibleCaptura] = useState(false);

  function showCaptura() {
    setVisibleCaptura(true);
  }

  function hideCaptura() {
    setVisibleCaptura(false);
  }

  return (
    <>
      <div>
        <Rodal
          visible={visibleCaptura}
          onClose={() => hideCaptura()}
          width={400}
          height={500}
        >
          <img
            src={orden.capturapago}
            className="rounded-md h-full w-full "
            alt="imagen captura"
          />
        </Rodal>
      </div>
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
          <td className="px-6 py-4 whitespace-no-wrap border-b ">
            <div className="text-sm leading-5 text-gray-800">
              <p className="">{orden.clientenombre}</p>
              <p className="">{orden.clientetelefono}</p>
            </div>
          </td>
          {/* <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-800  text-sm leading-5">
            {orden.clientetelefono}
          </td> */}
          <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-800  text-sm leading-5">
            {orden.orden.flatMap((platos, index) => (
              // key={orden.id} o key={index} para eliminar un error de keys
              <p key={index} className="text-gray-800">
                {platos.cantidad} {platos.nombre} ${platos.total.toFixed(2)}
              </p>
            ))}
          </td>
          <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-800  text-sm leading-5">
            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
              <span
                aria-hidden
                className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
              ></span>
              <span className="relative text-xs">
                ${orden.pagototal.toFixed(2)}
              </span>
            </span>
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
          <td className="px-6 py-4 whitespace-no-wrap border-b  text-gray-800 text-sm leading-5">
            {orden.referenciabanesco && (
              <div>
                <p className="block  ">Banco Banesco</p>

                <p className="">Referencia {orden.referenciabanesco}</p>
              </div>
            )}

            {orden.emailzelle && (
              <div>
                <p className="block  ">Zelle</p>
                <p className="">{orden.emailzelle}</p>
                <p className="">{orden.nombrezelle}</p>
              </div>
            )}

            {orden.referenciaplaza && (
              <div>
                <p className="block  ">Banco Plaza</p>

                <p className="">Referencia {orden.referenciaplaza}</p>
              </div>
            )}

            {orden.referenciapagomovilplaza && (
              <div>
                <p className="block  ">Pago Móvil Banco Plaza</p>

                <p className="">Referencia {orden.referenciapagomovilplaza}</p>
              </div>
            )}

            {orden.cantidadefectivo && (
              <div>
                <p className="block  ">Efectivo</p>

                <p className="">${orden.cantidadefectivo}</p>
              </div>
            )}

            <button
              className="flex px-5 py-2 mt-1 border-green-600 border text-green-600 rounded transition duration-300 hover:bg-green-600 hover:text-white focus:outline-none"
              onClick={() => showCaptura()}
            >
              Mostrar
            </button>
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default Pago;
