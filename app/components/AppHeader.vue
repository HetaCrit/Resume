<script setup lang="ts">
  const nuxtApp = useNuxtApp();
  const route = useRoute();

  //Main Menu Nav Items - Modify items under /composables/useNavMenu
  const { items: main_menu } = useMainNavMenu();

  //Account Menu Nav Items - Modify items under /composables/useNavMenu
  const { items: account_menu } = useAccountMenu();
</script>

<template>
  <UHeader
    class="bg-gradient-to-b from-primary/2 via-primary/1 to-transparent"
    :toggle="{
      color: 'primary',
      variant: 'subtle',
      class: 'rounded-full',
    }"
  >
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-8 shrink-0" />
      </NuxtLink>
      <div class="text-sm px-2 text-muted-foreground">Resume</div>
      <div class="pl-5 sm:pl-10">
        <AppHeaderQuickLinks />
      </div>
    </template>

    <template #right>
      <UNavigationMenu
        :items="main_menu"
        variant="link"
        class="hidden lg:block"
      />
      <UColorModeButton class="cursor-pointer" />
      <UDropdownMenu
        :items="account_menu"
        :popper="{ placement: 'bottom-end' }"
        class="cursor-pointer"
      >
        <UButton
          icon="i-lucide-more-horizontal"
          color="gray"
          variant="ghost"
          aria-label="More options"
        />
      </UDropdownMenu>
    </template>

    <template #body>
      <UNavigationMenu
        :items="main_menu"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
