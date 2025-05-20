import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import { FirebaseContext } from '../../firebase' //index

import Conductor from '../ui/Conductor'

const Conductores = () => {
  // State Para alojar los datos del conductor
  const [conductores, setConductores] = useState([])

  const { firebase } = useContext(FirebaseContext)

  useEffect(() => {
    function manejarSnapshot(snapshot) {
      const conductores = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })

      // almacenar los conductores en el estado
      setConductores(conductores)
    }

    const unsubscribe = firebase.db
      .collection('conductores')
      .onSnapshot(manejarSnapshot)

    return () => {
      // Unmouting
      unsubscribe()
    }
  }, [firebase.db]) // firebase.db

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Conductores</h1>
      <>
        <Link
          className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 text-white uppercase font-bold rounded"
          to="/crear-conductor"
        >
          {' '}
          Crear Conductor
        </Link>

        {conductores.map((conductor) => (
          <Conductor key={conductor.id} conductor={conductor} />
        ))}
      </>
    </div>
  )
}

export default Conductores
