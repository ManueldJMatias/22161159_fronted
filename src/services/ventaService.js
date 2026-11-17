
const API_URL = 'http://localhost:8080/api/ventas'

// Consultar todas las ventas
export async function listarVentas() {
  const respuesta = await fetch(API_URL)

  if (!respuesta.ok) {
    throw new Error('Error al consultar las ventas')
  }

  return await respuesta.json()
}

// Consultar una venta por ID
export async function obtenerVenta(id) {
  const respuesta = await fetch(`${API_URL}/${id}`)

  if (!respuesta.ok) {
    throw new Error('Error al consultar la venta')
  }

  return await respuesta.json()
}

// Registrar una venta
export async function crearVenta(venta) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(venta)
  })

  if (!respuesta.ok) {
    const error = await respuesta.json()
    throw new Error(error.message || 'Error al registrar la venta')
  }

  return await respuesta.json()
}

// Actualizar una venta
export async function actualizarVenta(id, venta) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(venta)
  })

  if (!respuesta.ok) {
    throw new Error('Error al actualizar la venta')
  }

  return await respuesta.json()
}

// Eliminar una venta
export async function eliminarVenta(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })

  if (!respuesta.ok && respuesta.status !== 204) {
    throw new Error('Error al eliminar la venta')
  }
}
