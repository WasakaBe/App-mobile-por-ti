import React from 'react'
import Router from './routers/routes'

export default function RootLayout() {
  return (
    <>
      {/* Aquí se renderiza el componente Router con toda la configuración */}
      <Router />
    </>
  )
}
