<script setup>
  definePageMeta({
    breadcrumb: "Error",
  });

  defineProps({
    error: Object,
  });
</script>

<template>
  <UApp>
    <AppHeader />

    <UMain class="relative">
      <HeroBackground
        class="absolute w-full -top-px transition-all text-primary shrink-0"
      />

      <UPageSection id="section1" class="relative overflow-hidden">
        <template #title>Oops! Something Went Wrong</template>
        <div class="mx-auto text-center">
          <div class="py-3">
            <UButton
              to="/"
              target="_self"
              icon="i-lucide-sun"
              size="lg"
              color="primary"
              variant="solid"
              class=""
              >Return Home
            </UButton>
          </div>
          <div class="pt-10 font-bold">
            Error Code: {{ error?.statusCode || "Unknown" }}
          </div>
          <div class="font-bold">
            Error Message: {{ error?.message || "Something went wrong" }}
          </div>
          <div class="pt-10">
            We’re sorry, but an unexpected error has occurred. Our team has been
            notified and is looking into it.
          </div>
        </div>
      </UPageSection>
    </UMain>

    <AppFooter />
  </UApp>
</template>
