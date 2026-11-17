
<script setup>
import { ref, onMounted } from 'vue'
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../services/productoService'

const productos = ref([])
const cargando = ref(false)
const error = ref('')
const busqueda = ref('')
const mostrarFormulario = ref(false)
const editando = ref(false)

const formulario = ref({
  id: null,
  nombre: '',
  descripcion: '',
  precio: '',
  stock: ''
})

const productosFiltrados = () => {
  return productos.value.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
}

async function cargarProductos() {
  cargando.value = true
  error.value = ''

  try {
    productos.value = await listarProductos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function nuevoProducto() {
  editando.value = false
  formulario.value = {
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
    stock: ''
  }
  mostrarFormulario.value = true
}

function editarProducto(producto) {
  editando.value = true
  formulario.value = { ...producto }
  mostrarFormulario.value = true
}

async function guardarProducto() {
  try {
    const producto = {
      nombre: formulario.value.nombre,
      descripcion: formulario.value.descripcion,
      precio: Number(formulario.value.precio),
      stock: Number(formulario.value.stock)
    }

    if (editando.value) {
      await actualizarProducto(formulario.value.id, producto)
      alert('Producto actualizado correctamente')
    } else {
      await crearProducto(producto)
      alert('Producto registrado correctamente')
    }

    mostrarFormulario.value = false
    await cargarProductos()
  } catch (e) {
    alert(e.message)
  }
}

async function borrarProducto(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return

  try {
    await eliminarProducto(id)
    alert('Producto eliminado correctamente')
    await cargarProductos()
  } catch (e) {
    alert(e.message)
  }
}

onMounted(cargarProductos)
</script>

<template>
  <section class="productos">
    <div class="encabezado">
      <div>
        <h2>Productos</h2>
        <p>Administra el inventario de tu negocio.</p>
      </div>

      <button class="btn-agregar" @click="nuevoProducto">
        + Nuevo producto
      </button>
    </div>

    <div class="panel">
      <div class="barra">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar producto por nombre..."
        />

        <button class="btn-recargar" @click="cargarProductos">
          Actualizar lista
        </button>
      </div>

      <p v-if="cargando">Cargando productos...</p>
      <p v-else-if="error" class="error">{{ error }}</p>

      <div v-else class="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="producto in productosFiltrados()" :key="producto.id">
              <td>#{{ producto.id }}</td>
              <td><strong>{{ producto.nombre }}</strong></td>
              <td>{{ producto.descripcion || 'Sin descripción' }}</td>
              <td>${{ Number(producto.precio).toFixed(2) }}</td>
              <td>
                <span :class="producto.stock > 0 ? 'stock-ok' : 'stock-bajo'">
                  {{ producto.stock }}
                </span>
              </td>
              <td>
                <button class="btn-editar" @click="editarProducto(producto)">
                  Editar
                </button>
                <button class="btn-eliminar" @click="borrarProducto(producto.id)">
                  Eliminar
                </button>
              </td>
            </tr>

            <tr v-if="productosFiltrados().length === 0">
              <td colspan="6" class="vacio">
                No se encontraron productos.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="mostrarFormulario" class="modal">
      <div class="formulario">
        <h3>{{ editando ? 'Editar producto' : 'Nuevo producto' }}</h3>

        <form @submit.prevent="guardarProducto">
          <label>Nombre</label>
          <input v-model="formulario.nombre" required />

          <label>Descripción</label>
          <textarea v-model="formulario.descripcion"></textarea>

          <label>Precio</label>
          <input
            v-model="formulario.precio"
            type="number"
            min="0.01"
            step="0.01"
            required
          />

          <label>Stock</label>
          <input
            v-model="formulario.stock"
            type="number"
            min="0"
            step="1"
            required
          />

          <div class="acciones-form">
            <button type="button" class="btn-cancelar"
              @click="mostrarFormulario = false">
              Cancelar
            </button>

            <button type="submit" class="btn-agregar">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.productos {
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

.encabezado p {
  color: #8490a2;
  font-size: 14px;
}

.btn-agregar, .btn-recargar, .btn-editar,
.btn-eliminar, .btn-cancelar {
  border: none;
  padding: 11px 15px;
  border-radius: 7px;
  cursor: pointer;
  font-weight: bold;
}

.btn-agregar {
  background: #4778ed;
  color: white;
}

.btn-recargar {
  background: #e9efff;
  color: #4778ed;
}

.panel {
  background: white;
  border: 1px solid #e9edf4;
  border-radius: 12px;
  padding: 22px;
}

.barra {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
}

.barra input, .formulario input,
.formulario textarea {
  border: 1px solid #dce2ec;
  border-radius: 7px;
  padding: 12px;
  width: 100%;
  outline: none;
}

.barra input {
  max-width: 400px;
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
  padding: 15px 10px;
  border-bottom: 1px solid #edf0f5;
}

.stock-ok {
  background: #e3f8ed;
  color: #168552;
  padding: 5px 10px;
  border-radius: 20px;
}

.stock-bajo {
  background: #fff0e7;
  color: #d36b29;
  padding: 5px 10px;
  border-radius: 20px;
}

.btn-editar {
  background: #e9efff;
  color: #4778ed;
  margin-right: 5px;
}

.btn-eliminar {
  background: #ffe8e8;
  color: #d74747;
}

.vacio {
  text-align: center;
  color: #8490a2;
  padding: 30px;
}

.error {
  color: #d74747;
}

.modal {
  position: fixed;
  inset: 0;
  background: #0008;
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 10;
}

.formulario {
  background: white;
  width: 100%;
  max-width: 450px;
  padding: 25px;
  border-radius: 12px;
}

.formulario h3 {
  margin-bottom: 20px;
}

.formulario label {
  display: block;
  margin: 12px 0 6px;
  font-size: 13px;
  font-weight: bold;
}

.formulario textarea {
  min-height: 75px;
  resize: vertical;
}

.acciones-form {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.btn-cancelar {
  background: #edf0f5;
  color: #536176;
}

.tabla-contenedor {
  overflow-x: auto;
}

@media (max-width: 650px) {
  .encabezado, .barra {
    flex-direction: column;
    align-items: stretch;
  }

  .barra input {
    max-width: none;
  }
}
</style>
