<script setup>
  //Quick Link Menu Items - Modify items under /composables/useNavMenu
  const { items: quicklink_menu } = useQuickLinkMenu();
</script>

<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="quicklink_menu"
    :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-0' }"
    size="xs"
  >
    <UButton
      label="Quick Links"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      size="xs"
      class="font-bold rounded-full truncate w-[130px] justify-center items-center"
      :class="[open && 'bg-primary/15']"
      :ui="{
        content:
          'transition-all duration-300 ease-in-out opacity-0 group-open:opacity-100 scale-95 group-open:scale-100',
        trailingIcon: [
          'transition-transform duration-200',
          open ? 'rotate-180' : undefined,
        ]
          .filter(Boolean)
          .join(' '),
      }"
    />
  </UDropdownMenu>
</template>
