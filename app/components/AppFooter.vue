<script setup lang="ts">
  const columns = [
    {
      label: "Quick Links",
      children: [
        {
          label: "About",
          to: "/#about",
        },
        {
          label: "Experience",
          to: "/#experience",
        },
        {
          label: "Skills",
          to: "/#skills",
        },
        {
          label: "Contact",
          to: "/#contact",
        },
      ],
    },
    {
      label: "Connect",
      children: [
        {
          label: "Email",
          to: "mailto:andrewbrownfamily@gmail.com",
        },
        {
          label: "Phone",
          to: "tel:832-288-0014",
        },
        {
          label: "LinkedIn",
          to: "#",
        },
        {
          label: "Download PDF",
          to: "/resume.pdf",
        },
      ],
    },
    {
      label: "Location",
      children: [
        {
          label: "Houston, United States",
          to: "#",
        },
      ],
    },
  ];

  const toast = useToast();

  const email = ref("");
  const loading = ref(false);

  function onSubmit() {
    loading.value = true;

    toast.add({
      title: "Message Sent!",
      description: "Thank you for your interest. I'll get back to you soon.",
    });

    // Reset form
    email.value = "";
    loading.value = false;
  }
</script>

<template>
  <USeparator icon="i-lucide:layers" :ui="{ border: 'border-primary/70' }" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField name="email" label="Send me a message" size="lg">
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="Enter your email"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      label="Send"
                      :loading="loading"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-sm text-muted">
        © {{ new Date().getFullYear() }} Andrew Brown. All rights reserved.
      </p>
    </template>

    <template #right>
      <UButton
        to="#"
        target="_blank"
        icon="i-simple-icons-linkedin"
        aria-label="LinkedIn"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="mailto:andrewbrownfamily@gmail.com"
        icon="i-lucide-mail"
        aria-label="Email"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="tel:832-288-0014"
        icon="i-lucide-phone"
        aria-label="Phone"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
