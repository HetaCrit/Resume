<script setup lang="ts">
  //components/AppLoading.vue
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useNuxtApp } from "#app";

  interface Props {
    color?: string;
    bgColor?: string;
    bgOpacity?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    color: "white",
    bgColor: "black",
    bgOpacity: "10",
  });

  //console.log("[Components/AppLoading.vue] Mounted with props:", props);

  const isLoading = ref(false);

  onMounted(() => {
    const nuxtApp = useNuxtApp();

    // Triggered right before navigation begins
    nuxtApp.hook("page:start", () => {
      isLoading.value = true;
    });

    // Triggered after navigation is complete
    nuxtApp.hook("page:finish", () => {
      isLoading.value = false;
    });
  });

  onBeforeUnmount(() => {
    // You can optionally unhook here if needed (not mandatory in most Nuxt 3 apps)
  });
</script>

<template>
  <transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 pointer-events-auto"
    >
      <div
        class="w-15 h-15 border-5 border-white border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  </transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
