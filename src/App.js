import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";

import Login from "./components/paginas/Login";
import SidebarLogin from "./components/ui/SidebarLogin";
import Sidebar from "./components/ui/Sidebar";
import PoliticasPrivacidad from "./components/paginas/PoliticasPrivacidad";
import Soporte from "./components/paginas/Soporte";
import Negocios from "./components/paginas/Negocios";
import CrearNegocio from "./components/paginas/CrearNegocio";
import EditarNegocio from "./components/paginas/EditarNegocio";
import Menu from "./components/paginas/Menu";
import CrearPlato from "./components/paginas/CrearPlato";
import EditarPlato from "./components/paginas/EditarPlato";
import Conductores from "./components/paginas/Conductores";
import CrearConductor from "./components/paginas/CrearConductor";
import EditarConductor from "./components/paginas/EditarConductor";
import OrdenesGeneralesConductor from "./components/paginas/OrdenesGeneralesConductor";
import OrdenesGenerales from "./components/paginas/OrdenesGenerales";
import Pagos from "./components/paginas/Pagos";
import Promociones from "./components/paginas/Promociones";
import CrearPromocion from "./components/paginas/CrearPromocion";
import EditarPromocion from "./components/paginas/EditarPromocion";
import Configuraciones from "./components/paginas/Configuraciones";

import firebase, { FirebaseContext } from "./firebase"; // Desde el index. Y aqui se utilizan para envolver toda la app con firebase
import PedidoState from "./context/pedidos/pedidosState";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import aviso from "./sounds/r2d2_sms.mp3";

function App() {
  const [isSinged, setIsSinged] = useState(false);
  // const customId = "custom-id-yes";

  // const notify = (hora) =>
  //   toast.error(`Ordenes sin verificar! ${hora}`, {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     toastId: customId,
  //   });

  // const tono = new Audio(aviso);

  // const playSound = (audioFile) => {
  //   audioFile.play();
  // };

  // Si existe un usuario logeado, obtiene y guarda el token y escucha notificaciones
  useEffect(() => {
    try {
      firebase.auth.onAuthStateChanged(async (user) => {
        if (user) {
          firebase.messaging
            .requestPermission()
            .then(() => {
              return firebase.messaging.getToken();
            })
            .then((token) => {
              console.log("Token actual es: ", token);
              saveTokenToDatabase(token);
            })
            .catch((error) => {
              console.log("Error obteniendo token", error);
            });

          // firebase.messaging.onMessage((payload) => {
          //   // console.log("Mensaje foreground recibido. ", payload);

          //   // Toma la hora mandada del push
          //   const hora = new Date(
          //     Number(payload.data.timestamp)
          //   ).toLocaleTimeString();

          //   // Si hay un mensaje en foreground muestra suena y muestra una notificacion
          //   playSound(tono);
          //   notify(hora);
          // });
          setIsSinged(true);

          // Si hay un cambio de token, obtiene y guarda el nuevo token
          firebase.messaging.onTokenRefresh((token) => {
            console.log("Token refrescado es: ", token);
            saveTokenToDatabase(token);
          });
        } else {
          setIsSinged(false);
        }

        // user ? setIsSinged(true) : setIsSinged(false);
      });
    } catch (error) {
      console.log("error de login:", error);
    }
    // eslint-disable-next-line
  }, []); // tono

  async function saveTokenToDatabase(token) {
    // Assume admin is already signed in
    // const admin = firebase.auth.currentUser.uid;

    // dev admin id = wBJ6GvWK44ShWK9QQCV6paJpRzu2
    // production admin id = FxzoJFyqP3b0SKFEygPXSWcEugz1

    const adminId = "FxzoJFyqP3b0SKFEygPXSWcEugz1";

    // Se obtiene la lista de tokens del admin
    const tokenList = await firebase.db
      .collection("admin")
      .doc(adminId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data().fcmToken;
        } else {
          // doc.data() will be undefined in this case
          console.log("No existe el documento!");
        }
      })
      .catch((error) => {
        console.log("Error obteniendo documento:", error);
      });

    if (tokenList !== undefined) {
      // Se agrega el token nuevo a la lista de tokens
      let dataTokens = [...tokenList, token];
      // console.log("Token list", tokenList);
      // console.log("Tokens", tokens);

      // Elimina los tokens repetidos
      let tokens = dataTokens.filter((item, index) => {
        return dataTokens.indexOf(item) === index;
      });

      // Se guarda la lista de tokens nueva
      await firebase.db.collection("admin").doc(adminId).update({
        fcmToken: tokens,
      });
    }
  }

  return (
    <>
      <PedidoState>
        <FirebaseContext.Provider value={{ firebase }}>
          {!isSinged ? (
            <div className="md:flex min-h-screen">
              <SidebarLogin />
              <div className="md:w-3/5 xl:w-4/5 ">
                <Routes>
                  <Route exact path="/" element={<Login />} />
                  <Route
                    exact
                    path="/politicas-privacidad"
                    element={<PoliticasPrivacidad />}
                  />
                  <Route exact path="/soporte" element={<Soporte />} />
                </Routes>
              </div>
            </div>
          ) : (
            <div className="md:flex min-h-screen">
              <Sidebar />
              <div className="md:w-3/5 xl:w-4/5">
                <Routes>
                  <Route exact path="/" element={<Negocios />} />
                  <Route path="/crear-negocio" element={<CrearNegocio />} />
                  <Route path="/editar-negocio" element={<EditarNegocio />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/crear-plato" element={<CrearPlato />} />
                  <Route path="/editar-plato" element={<EditarPlato />} />
                  <Route path="/conductores" element={<Conductores />} />
                  <Route path="/crear-conductor" element={<CrearConductor />} />
                  <Route
                    path="/editar-conductor"
                    element={<EditarConductor />}
                  />
                  <Route
                    path="/ordenes-conductor"
                    element={<OrdenesGeneralesConductor />}
                  />
                  <Route path="/ordenes" element={<OrdenesGenerales />} />
                  <Route path="/pagos" element={<Pagos />} />
                  <Route path="/promociones" element={<Promociones />} />
                  <Route path="/crear-promocion" element={<CrearPromocion />} />
                  <Route
                    path="/editar-promocion"
                    element={<EditarPromocion />}
                  />
                  <Route
                    path="/configuraciones"
                    element={<Configuraciones />}
                  />
                </Routes>
              </div>
              {/* <div>
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div> */}
            </div>
          )}
        </FirebaseContext.Provider>
      </PedidoState>
    </>
  );
}

export default App;
