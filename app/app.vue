<script setup lang="ts">
  const colorMode = useColorMode();

  // Set default mode to dark
  if (!colorMode.preference) {
    colorMode.preference = "dark";
  }

  const color = computed(() =>
    colorMode.value === "dark" ? "#171717" : "white"
  );

  useHead({
    title: "Andrew Brown - Resume",
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { key: "theme-color", name: "theme-color", content: color },
      // Added for better SEO/Social Sharing
      {
        name: "description",
        content: "Andrew Brown - Software Developer and AI Enthusiast",
      },
      { property: "og:title", content: "Andrew Brown - Resume" },
      {
        property: "og:description",
        content: "Software Developer and AI Enthusiast",
      },
    ],
    link: [{ rel: "icon", href: "/favicon.ico" }],
    htmlAttrs: {
      lang: "en",
    },
  });
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <HeroBackground
          class="absolute w-full -top-px transition-all text-primary shrink-0"
        />
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
