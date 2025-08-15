<script setup lang="ts">
  import type { BreadcrumbItem } from "~/types/navigation";

  const route = useRoute();
  const breadcrumb_items = ref<BreadcrumbItem[]>([]);
  const isHomePage = computed(() => route.path === "/");

  // Track changes to route and regenerate breadcrumbs
  watch(
    () => route.path,
    (newRoutePath) => {
      console.log(
        "[components/AppBreadcrumb.vue] Route Changed | FullPath:",
        route.fullPath,
        " | Path:",
        newRoutePath,
        " | ",
        import.meta.server ? "server" : "client"
      );

      const segments = newRoutePath.split("/").filter(Boolean);

      const crumbs: BreadcrumbItem[] = [
        {
          label: "Home",
          icon: "i-lucide-house",
          to: "/",
        },
      ];

      let pathAccumulator = "";
      segments.forEach((segment) => {
        pathAccumulator += `/${segment}`;

        const matchedRoute = route.matched.find(
          (r) => r.path === pathAccumulator
        );

        const label =
          typeof matchedRoute?.meta?.breadcrumb === "string"
            ? matchedRoute.meta.breadcrumb
            : segment.charAt(0).toUpperCase() + segment.slice(1);

        crumbs.push({
          label,
          icon: "i-lucide-box",
          to: pathAccumulator,
        });
      });

      breadcrumb_items.value = crumbs;
    },
    { immediate: true }
  ); // immediate: true runs it once on component mount
</script>

<template>
  <div class="flex justify-center">
    <!-- Hide breadcrumb if on home page -->
    <div v-if="!isHomePage" class="px-5 py-2">
      <UBreadcrumb separator-icon="" :items="breadcrumb_items" />
    </div>
  </div>
</template>
