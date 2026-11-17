
<script setup>
import { ref, computed, onMounted } from 'vue'
import { listarProductos } from '../services/productoService'
import {
  listarVentas,
  crearVenta,
  actualizarVenta,
  eliminarVenta
} from '../services/ventaService'

const productos = ref([])
const ventas = ref([])
const detalles = ref([])
const cargando = ref(false)
const error = ref('')
const mensaje = ref('')

const productoSeleccionado = ref('')
const cantidad = ref(1)

const total = computed(() => {
  return detalles.value.reduce((suma, detalle) => {
    return suma + Number(detalle.producto.precio) * detalle.cantidad
  }, 0)
})

const productosDisponibles = computed(() => {
  return productos.value.filter(producto => producto.stock > 0)
})

async function cargarDatos() {
  cargando.value = true
  error.value = ''

  try {
    const [listaProductos, listaVentas] = await Promise.all([
      listarProductos(),
      listarVentas()
    ])

    productos.value = listaProductos
    ventas.value = listaVentas
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function agregarProducto() {
  mensaje.value = ''

  const producto = productos.value.find(
    p => p.id === Number(productoSeleccionado.value)
  )

  if (!producto) {
    alert('Selecciona un producto')
    return
  }

  if (cantidad.value < 1 || !Number.isInteger(Number(cantidad.value))) {
    alert('La cantidad debe ser un número entero mayor a cero')
    return
  }

  const existente = detalles.value.find(
    d => d.producto.id === producto.id
  )

  const cantidadTotal = (existente?.cantidad || 0) + Number(cantidad.value)

  if (cantidadTotal > producto.stock) {
    alert('No hay suficiente stock disponible')
    return
  }

  if (existente) {
    existente.cantidad = cantidadTotal
  } else {
    detalles.value.push({
      producto,
      cantidad: Number(cantidad.value)
    })
  }

  productoSeleccionado.value = ''
  cantidad.value = 1
}

function quitarProducto(id) {
  detalles.value = detalles.value.filter(
    detalle => detalle.producto.id !== id
  )
}

async function registrarVenta() {
  if (detalles.value.length === 0) {
    alert('Agrega al menos un producto')
    return
  }

  try {
    const venta = {
      detalles: detalles.value.map(detalle => ({
        producto: {
          id: detalle.producto.id
        },
        cantidad: detalle.cantidad
      }))
    }

    await crearVenta(venta)

    alert('¡Venta registrada correctamente!')

    detalles.value = []
    await cargarDatos()
  } catch (e) {
    alert(e.message)
  }
}

async function borrarVenta(id) {
  if (!confirm(`¿Deseas eliminar la venta #${id}? El inventario será restaurado.`)) {
    return
  }

  try {
    await eliminarVenta(id)
    alert('Venta eliminada correctamente')
    await cargarDatos()
  } catch (e) {
    alert(e.message)
  }
}

async function modificarVenta(venta) {
  const detallesOriginales = venta.detalles || []

  const nuevosDetalles = detallesOriginales.map(detalle => ({
    producto: {
      id: detalle.producto.id
    },
    cantidad: detalle.cantidad
  }))

  const confirmar = confirm(
    `¿Deseas actualizar la venta #${venta.id} duplicando las cantidades actuales?`
  )

  if (!confirmar) return

  try {
    await actualizarVenta(venta.id, {
      detalles: nuevosDetalles.map(detalle => ({
        ...detalle,
        cantidad: detalle.cantidad
      }))
    })

    alert('Venta actualizada correctamente')
    await cargarDatos()
  } catch (e) {
    alert(e.message)
  }
}


function formatoPrecio(valor) {
  return Number(valor).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
  })
}

onMounted(cargarDatos)
</script>

<template>
  <section class="ventas-view">

    <div class="encabezado">
      <div>
        <h2>Gestión de ventas</h2>
        <p>Registra operaciones y administra tus ventas.</p>
      </div>

      <button class="btn-recargar" @click="cargarDatos">
        Actualizar datos
      </button>
    </div>

    <p v-if="cargando">Cargando información...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div class="panel">
      <h3>Nueva venta</h3>
      <p class="subtitulo">Selecciona los productos que deseas vender.</p>

      <div class="selector">
        <div>
          <label>Producto</label>
          <select v-model="productoSeleccionado">
            <option value="">Seleccionar producto</option>

            <option
              v-for="producto in productosDisponibles"
              :key="producto.id"
              :value="producto.id"
            >
              {{ producto.nombre }} -
              {{ formatoPrecio(producto.precio) }} -
              Stock: {{ producto.stock }}
            </option>
          </select>
        </div>

        <div>
          <label>Cantidad</label>
          <input
            type="number"
            min="1"
            step="1"
            v-model.number="cantidad"
          />
        </div>

        <button class="btn-agregar" @click="agregarProducto">
          + Agregar
        </button>
      </div>

      <h4 class="titulo-tabla">Productos de la venta</h4>

      <div class="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="detalle in detalles" :key="detalle.producto.id">
              <td>{{ detalle.producto.nombre }}</td>
              <td>{{ formatoPrecio(detalle.producto.precio) }}</td>
              <td>{{ detalle.cantidad }}</td>
              <td>
                {{ formatoPrecio(detalle.producto.precio * detalle.cantidad) }}
              </td>
              <td>
                <button
                  class="btn-quitar"
                  @click="quitarProducto(detalle.producto.id)"
                >
                  Quitar
                </button>
              </td>
            </tr>

            <tr v-if="detalles.length === 0">
              <td colspan="5" class="vacio">
                Todavía no agregas productos a esta venta.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total">
        <span>Total de la venta</span>
        <strong>{{ formatoPrecio(total) }}</strong>
      </div>

      <button
        class="btn-registrar"
        :disabled="detalles.length === 0"
        @click="registrarVenta"
      >
        Registrar venta
      </button>
    </div>

    <div class="panel historial">
      <h3>Historial de ventas</h3>
      <p class="subtitulo">Ventas registradas en el sistema.</p>

      <div class="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="venta in ventas" :key="venta.id">
  <td>#{{ venta.id }}</td>
  <td>{{ venta.fecha ? new Date(venta.fecha).toLocaleString('es-MX') : 'Sin fecha' }}</td>
  <td>{{ venta.detalles?.length || 0 }}</td>
  <td>{{ formatoPrecio(venta.total) }}</td>

  <td>
    <button class="btn-editar" @click="modificarVenta(venta)">
      Actualizar
    </button>

    <button class="btn-quitar" @click="borrarVenta(venta.id)">
      Eliminar
    </button>
  </td>
</tr>

            <tr v-if="ventas.length === 0">
              <td colspan="5" class="vacio">
                Todavía no hay ventas registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </section>
</template>

<style scoped>
.ventas-view {
  width: 100%;
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 15px;
}

.encabezado h2 {
  font-size: 25px;
  margin-bottom: 7px;
}

.encabezado p, .subtitulo {
  color: #8490a2;
  font-size: 14px;
  margin-top: 5px;
}

.panel {
  background: white;
  border: 1px solid #e9edf4;
  border-radius: 12px;
  padding: 23px;
  margin-bottom: 25px;
}

.panel h3 {
  font-size: 19px;
}

.selector {
  display: grid;
  grid-template-columns: 1fr 140px auto;
  gap: 15px;
  align-items: end;
  margin: 25px 0;
}

label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 8px;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #dce2ec;
  border-radius: 7px;
  background: white;
}

button {
  border: none;
  padding: 12px 16px;
  border-radius: 7px;
  cursor: pointer;
  font-weight: bold;
}

.btn-agregar, .btn-registrar {
  background: #4778ed;
  color: white;
}

.btn-recargar {
  background: #e9efff;
  color: #4778ed;
}

.btn-quitar {
  background: #ffe8e8;
  color: #d74747;
}

.titulo-tabla {
  margin: 20px 0 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th {
  background: #f5f7fb;
  color: #657187;
  text-align: left;
}

th, td {
  padding: 14px 10px;
  border-bottom: 1px solid #edf0f5;
}

.vacio {
  text-align: center;
  color: #8490a2;
  padding: 25px;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-top: 10px;
  border-top: 1px solid #edf0f5;
}

.total strong {
  font-size: 24px;
  color: #4778ed;
}

.btn-registrar:disabled {
  background: #aab7d1;
  cursor: not-allowed;
}

.historial {
  margin-top: 25px;
}

.error {
  color: #d74747;
  margin-bottom: 15px;
}

.tabla-contenedor {
  overflow-x: auto;
}

@media (max-width: 700px) {
  .selector {
    grid-template-columns: 1fr;
  }

  .encabezado {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
