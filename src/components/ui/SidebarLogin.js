import React from "react";
import { NavLink } from "react-router-dom";

const SidebarLogin = () => {
  return (
    <div className="md:w-2/5 xl:w-1/5 bg-gray-800 rounded p-3 shadow-lg">
      <div className="flex items-center space-x-4 p-2 mb-5">
        <img
          className="h-12 rounded"
          src={require("../../assets/favicon.ico")}
          alt=""
        />
        <div>
          <h4 className="font-semibold text-lg uppercase text-white font-poppins tracking-wide">
            Ubix Admin
          </h4>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        <li>
          <NavLink
            exact="true"
            to="/"
            className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
          >
            {/* <a
              href="/#"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
            > */}
            <span className="">
              <svg
                className="h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <span>Iniciar sesión</span>
            {/* </a> */}
          </NavLink>
        </li>
        <li>
          <NavLink
            exact="true"
            to="/politicas-privacidad"
            className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
          >
            {/* <a
              href="/#"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
            > */}
            <span className="">
              <svg
                className="h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                ></path>
              </svg>
            </span>
            <span>Política de Privacidad</span>
            {/* </a> */}
          </NavLink>
        </li>
        <li>
          <NavLink
            exact="true"
            to="/soporte"
            className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
          >
            {/* <a
              href="/#"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
            > */}
            <span className="">
              <svg
                className="h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </span>
            <span>Soporte</span>
            {/* </a> */}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SidebarLogin;
