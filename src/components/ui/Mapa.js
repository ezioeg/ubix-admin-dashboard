import React, { useState, useEffect, useContext } from "react";

import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

import { FirebaseContext } from "../../firebase"; //index

const mapStyles = {
    width: "93.2%",
    height: "70%",
};

const Mapa = (props) => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [nombre, setNombre] = useState("");
    // Context de firebase para cambios en la base de datos
    const { firebase } = useContext(FirebaseContext);
    // Para mostrar solo los platos de este negocio
    const user = firebase.auth.currentUser;
    const restauranteID = user ? user.uid : null;

    useEffect(() => {
        if (restauranteID) {
            const unsubscribe = firebase.db
                .collection("restaurantes")
                .doc(props.id)
                .onSnapshot(function (doc) {
                    const datosRestaurante = {
                        ...doc.data(),
                    };

                    setLatitude(datosRestaurante.coordinates.latitude);
                    setLongitude(datosRestaurante.coordinates.longitude);
                    setNombre(datosRestaurante.nombre);
                });

            return () => {
                // Unmouting
                unsubscribe();
            };
        }
    }, [firebase.db, props.id, restauranteID]); // firebase.db, props.id, restauranteID

    return (
        <>
            <div>
                {latitude && longitude ? (
                    <div>
                        <Map
                            google={props.google}
                            zoom={18}
                            style={mapStyles}
                            initialCenter={{ lat: latitude, lng: longitude }}
                        >
                            <Marker
                                position={{ lat: latitude, lng: longitude }}
                                title={nombre}
                            />
                        </Map>
                    </div>
                ) : null}
            </div>
        </>
    );
};
export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
})(Mapa);
