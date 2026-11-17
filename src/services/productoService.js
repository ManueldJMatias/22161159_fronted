
const API_URL = 'http://localhost:8080/api/productos'

// Obtener todos los productos
export async function listarProductos() {
  const respuesta = await fetch(API_URL)

  if (!respuesta.ok) {
    throw new Error('Error al consultar los productos')
  }

  return await respuesta.json()
}

// Registrar un producto
export async function crearProducto(producto) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  })

  if (!respuesta.ok) {
    throw new Error('Error al registrar el producto')
  }

  return await respuesta.json()
}

// Actualizar un producto
export async function actualizarProducto(id, producto) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  })

  if (!respuesta.ok) {
    throw new Error('Error al actualizar el producto')
  }

  return await respuesta.json()
}

// Eliminar un producto
export async function eliminarProducto(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })

  if (!respuesta.ok && respuesta.status !== 204) {
    throw new Error('Error al eliminar el producto')
  }
}
