<script setup lang="ts">
import { onMounted } from "vue";
import { initCity } from "@/enter";

onMounted(() => {
  initCity();
});
</script>

<template>
  <canvas id="webgl">浏览器不支持canvas，请切换浏览器重试</canvas>
</template>

<style></style>
