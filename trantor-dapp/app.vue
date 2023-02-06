<template>
  <div class="m-16">
    <NuxtPage/>
  </div>
</template>
<script setup>
import {useHead} from "nuxt/app";

useHead({
  bodyAttrs: {
    class: 'bg-gray-800'
  }
})

</script>