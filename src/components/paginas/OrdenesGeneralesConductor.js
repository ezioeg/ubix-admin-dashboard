import React from "react";

import OrdenesPendientesConductor from "./OrdenesPendientesConductor";
import OrdenesEntregadasConductor from "./OrdenesEntregadasConductor";

const Tabs = ({ color }) => {
  const [openTab, setOpenTab] = React.useState(1);
  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center ">
          Ordenes Conductor
        </h1>
        <div className="flex flex-wrap">
          <div className="w-full">
            <ul
              className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
              role="tablist"
            >
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "font-bold  px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === 1
                      ? "text-white bg-" + color + "-800"
                      : "text-" + color + "-800 bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(1);
                  }}
                  data-toggle="tab"
                  href="#link1"
                  role="tablist"
                >
                  Ordenes Pendientes
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    " font-bold  px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === 2
                      ? "text-white bg-" + color + "-800"
                      : "text-" + color + "-800 bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                  data-toggle="tab"
                  href="#link2"
                  role="tablist"
                >
                  Ordenes Entregadas
                </a>
              </li>
            </ul>
            {/* <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded "> */}
            {/* <div className="px-2 py-5 flex-auto"> */}
            <div className="tab-content tab-space">
              <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                <OrdenesPendientesConductor />
              </div>
              <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                <OrdenesEntregadasConductor />
              </div>
            </div>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default function OrdenesGeneralesConductor() {
  return (
    <>
      <Tabs color="gray" />
    </>
  );
}
