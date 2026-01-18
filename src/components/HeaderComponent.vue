<script setup lang="ts">
import { RouteName } from "@/router";
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <a class="navbar-brand" href="#">Voxette</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarCollapse"
      aria-controls="navbarCollapse"
      aria-expanded="false"
      aria-label="Toggla meny"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">Hem <span class="sr-only">(aktuell)</span></a>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" :to="{ name: RouteName.Contact }">Kontakt</RouterLink>
        </li>
      </ul>
      <div class="mt-2 mt-md-0">
        <button class="btn btn-outline my-2 my-sm-0">Logga in</button>
      </div>
    </div>
  </nav>
</template>
