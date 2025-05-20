import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../../firebase"; //index

const Sidebar = () => {
    // Context con las operaciones de firebase
    const { firebase } = useContext(FirebaseContext);

    //Hook para redireccionar
    const navigate = useNavigate();
    return (
        <div className="md:w-2/5 xl:w-1/5 bg-gray-800 rounded p-3 shadow-lg">
            <div className="flex items-center space-x-4 p-2 mb-5">
                <img
                    className="h-12 rounded-full"
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
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                        </span>
                        <span>Negocios</span>
                        {/* </a> */}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        exact="true"
                        to="/conductores"
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
                        <span>Conductores</span>
                        {/* </a> */}
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        exact="true"
                        to="/promociones"
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
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </span>
                        <span>Promociones</span>
                        {/* </a> */}
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        exact="true"
                        to="/configuraciones"
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
                        <span>Configuraciones</span>
                        {/* </a> */}
                    </NavLink>
                </li>

                <li
                    onClick={() => {
                        firebase.auth.signOut();
                        navigate("/");
                    }}
                >
                    <a
                        href="/"
                        className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
                    >
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
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </span>
                        <span>Cerrar sesión</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
