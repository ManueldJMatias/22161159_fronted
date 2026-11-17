
<script setup>
import ProductosView from './views/ProductosView.vue'
import VentasView from './views/VentasView.vue'
import { ref } from 'vue'

const seccion = ref('inicio')

const cambiarSeccion = (nombre) => {
  seccion.value = nombre
}
</script>

<template>
  <div class="app">
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">V</span>
        <div>
          <h2>VentaPro</h2>
          <small>Gestión de ventas</small>
        </div>
      </div>

      <p class="menu-title">MENÚ PRINCIPAL</p>

      <nav>
        <button
          :class="{ active: seccion === 'inicio' }"
          @click="cambiarSeccion('inicio')"
        >
          <span>⌂</span> Inicio
        </button>

        <button
          :class="{ active: seccion === 'productos' }"
          @click="cambiarSeccion('productos')"
        >
          <span>▣</span> Productos
        </button>

        <button
          :class="{ active: seccion === 'ventas' }"
          @click="cambiarSeccion('ventas')"
        >
          <span>▤</span> Ventas
        </button>
      </nav>

      <div class="sidebar-footer">
        Sistema de Gestión de Ventas
        <small>Versión 1.0</small>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div>
          <h1>Gestión de Ventas</h1>
          <p>Administra tus productos y operaciones</p>
        </div>
        <div class="user">
          <div class="avatar">A</div>
          <span>Administrador</span>
        </div>
      </header>

      <section v-if="seccion === 'inicio'" class="content">
        <div class="welcome">
          <div>
            <span class="tag">PANEL PRINCIPAL</span>
            <h2>¡Bienvenido a VentaPro!</h2>
            <p>Controla tus productos, inventario y ventas desde un solo lugar.</p>
          </div>
          <div class="welcome-icon">📊</div>
        </div>

        <h3 class="section-title">Resumen del sistema</h3>

        <div class="cards">
          <div class="card">
            <span class="card-icon blue">▣</span>
            <p>Productos</p>
            <h2>Inventario</h2>
            <small>Consulta tus productos registrados</small>
          </div>

          <div class="card">
            <span class="card-icon green">▤</span>
            <p>Ventas</p>
            <h2>Operaciones</h2>
            <small>Administra tus ventas realizadas</small>
          </div>

          <div class="card">
            <span class="card-icon orange">◷</span>
            <p>Inventario</p>
            <h2>Control de stock</h2>
            <small>Revisa las existencias disponibles</small>
          </div>
        </div>

        <div class="info-panel">
          <h3>Acerca del sistema</h3>
          <p>
            VentaPro es un sistema de gestión de ventas que permite registrar
            productos, controlar existencias y administrar ventas con varios
            productos por operación.
          </p>
        </div>
      </section>

      <section v-else-if="seccion === 'productos'" class="content">
  <ProductosView />
</section>

      <section v-else-if="seccion === 'ventas'" class="content">
  <VentasView />
</section>
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #f4f6fb;
  color: #202b3c;
}

button {
  font: inherit;
}

.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #17243a;
  color: white;
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 50px;
}

.logo-icon {
  background: #4778ed;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-weight: bold;
  font-size: 22px;
}

.logo h2 {
  font-size: 19px;
}

.logo small {
  color: #9eacc2;
}

.menu-title {
  color: #8492aa;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 15px;
}

nav {
  display: grid;
  gap: 9px;
}

nav button {
  border: none;
  background: transparent;
  color: #bdc8d9;
  padding: 14px;
  text-align: left;
  border-radius: 9px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
}

nav button:hover,
nav button.active {
  background: #30496c;
  color: white;
}

nav button span {
  font-size: 19px;
}

.sidebar-footer {
  margin-top: auto;
  color: #9eacc2;
  font-size: 12px;
  line-height: 2;
}

.sidebar-footer small {
  display: block;
}

.main {
  flex: 1;
  min-width: 0;
}

.topbar {
  background: white;
  padding: 23px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e7eaf0;
}

.topbar h1 {
  font-size: 22px;
}

.topbar p {
  color: #8490a2;
  margin-top: 5px;
  font-size: 13px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.avatar {
  background: #e6edff;
  color: #4778ed;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: bold;
}

.content {
  padding: 35px;
}

.welcome {
  background: linear-gradient(120deg, #263e66, #4778ed);
  color: white;
  border-radius: 16px;
  padding: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 190px;
}

.tag {
  font-size: 10px;
  letter-spacing: 2px;
  opacity: .8;
}

.welcome h2 {
  margin: 14px 0 9px;
  font-size: 26px;
}

.welcome p {
  color: #e1e9ff;
  font-size: 14px;
}

.welcome-icon {
  font-size: 65px;
  opacity: .85;
}

.section-title {
  margin: 32px 0 18px;
  font-size: 18px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.card,
.info-panel {
  background: white;
  border: 1px solid #e9edf4;
  border-radius: 13px;
  padding: 22px;
}

.card-icon {
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  font-size: 22px;
}

.blue {
  background: #e8efff;
  color: #4778ed;
}

.green {
  background: #e3f8ed;
  color: #21a46a;
}

.orange {
  background: #fff1df;
  color: #e79a35;
}

.card p {
  color: #8490a2;
  font-size: 13px;
  margin-top: 18px;
}

.card h2 {
  font-size: 19px;
  margin: 7px 0;
}

.card small {
  color: #8490a2;
  font-size: 12px;
}

.info-panel {
  margin-top: 25px;
  line-height: 1.7;
}

.info-panel h3 {
  margin-bottom: 10px;
}

.info-panel p {
  color: #748095;
  font-size: 14px;
}

@media (max-width: 800px) {
  .sidebar {
    width: 190px;
  }

  .cards {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 20px;
  }
}

@media (max-width: 550px) {
  .sidebar {
    width: 150px;
    padding: 15px 10px;
  }

  .topbar {
    padding: 18px;
  }

  .user span {
    display: none;
  }

  .welcome {
    padding: 22px;
  }

  .welcome-icon {
    display: none;
  }
}
</style>
