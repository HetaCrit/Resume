<script setup lang="ts">
  const { loggedIn } = useUserSession();

  const showCreateInput = ref(false);
  const newProjectName = ref("");

  // Reactive project list (non-SSR to avoid hydration mismatch)
  const { data: projectLinks, refresh } = await useFetch(
    "/api/secure/projects",
    {
      server: false,
      key: "projects-sidebar",
      default: () => [],
    }
  );

  const createProject = async () => {
    const id = Math.random().toString(36).slice(2);

    if (!newProjectName.value.trim()) return;

    try {
      await $fetch("/api/secure/projects", {
        method: "POST",
        body: {
          label: newProjectName.value,
          to: `/chat/${id}`,
        },
      });

      newProjectName.value = "";
      showCreateInput.value = false;

      await refresh(); // Refresh project list
      await navigateTo(`/chat/${id}`);
    } catch (e) {
      console.error("Failed to create project:", e);
    }
  };

  const models = ["gpt-4", "claude-3", "llama-3", "mistral"];
  const selectedModel = ref("gpt-4");
</script>

<template>
  <AppLoading color="primary" />

  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      :min-size="10"
      class="bg-elevated/50"
    >
      <template #header="{ collapsed }">
        <div class="flex w-full">
          <NuxtLink to="/">
            <AppLogo class="w-auto h-8 shrink-0" />
          </NuxtLink>
          <NuxtLink to="/" class="flex items-end gap-0.5 pl-2">
            <span v-if="!collapsed" class="text-lg font-bold text-highlighted"
              >Chat</span
            >
          </NuxtLink>

          <div v-if="!collapsed" class="flex items-center gap-1.5 ms-auto">
            <UDashboardSearchButton collapsed class="hidden" />
            <UDashboardSidebarCollapse />
          </div>
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="flex flex-col gap-1.5">
          <UButton
            v-bind="
              collapsed
                ? { icon: 'i-lucide-message-square-plus' }
                : { label: 'New Chat' }
            "
            color="primary"
            block
            to="/chat/create"
          />

          <div class="relative">
            <UDropdown :popper="{ placement: 'bottom-start' }">
              <template #trigger>
                <UButton
                  icon="i-lucide-folder"
                  label="Projects"
                  variant="soft"
                  block
                />
              </template>

              <template #default>
                <div class="p-3 min-w-[220px] flex flex-col gap-2">
                  <!-- Create New Project -->
                  <UButton
                    icon="i-lucide-plus"
                    label="Create Project"
                    size="sm"
                    @click="showCreateInput = true"
                  />

                  <div v-if="showCreateInput" class="flex gap-2">
                    <UInput
                      v-model="newProjectName"
                      placeholder="Project name"
                      class="w-full"
                    />
                    <UButton icon="i-lucide-check" @click="createProject" />
                  </div>

                  <!-- List Projects -->
                  <div
                    v-if="projectLinks.length"
                    class="flex flex-col gap-1 mt-2"
                  >
                    <NuxtLink
                      v-for="proj in projectLinks"
                      :key="proj.to"
                      :to="proj.to"
                      class="text-sm px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {{ proj.label }}
                    </NuxtLink>
                  </div>

                  <div v-else class="text-sm text-gray-400 mt-2">
                    No projects yet.
                  </div>
                </div>
              </template>
            </UDropdown>
          </div>
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch />

    <div class="w-full h-full overflow-auto">
      <AppBreadcrumb />
      <USelectMenu
        v-model="selectedModel"
        :options="models"
        class="w-[160px]"
        placeholder="Select Model"
      />
      <slot />
      <AppFooter />
    </div>
  </UDashboardGroup>
</template>
