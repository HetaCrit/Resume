// composables/useNavMenu.ts

// This file defines the navigation menus for the application.
// https://ui.nuxt.com/components/dropdown-useNavMenu

// Items for the Quick Link Menu
export const useQuickLinkMenu = () => {
  const items = computed(() => [
    { label: "Home", to: "/", icon: "i-lucide-home" },
    { type: "separator" },
    { label: "About", to: "/#about", icon: "i-lucide-user" },
    { label: "Experience", to: "/#experience", icon: "i-lucide-briefcase" },
    { label: "Education", to: "/#education", icon: "i-lucide-graduation-cap" },
    { label: "Skills", to: "/#skills", icon: "i-lucide-sparkles" },
    { label: "My Story", to: "/#my-story", icon: "i-lucide-book-open" },
    { label: "Projects", to: "/#projects", icon: "i-lucide-code" },
    { label: "Contact", to: "/#contact", icon: "i-lucide-mail" },
  ]);
  return { items };
};

// Items for the Main Nav Menu
export const useMainNavMenu = () => {
  const items = computed(() => [
    { label: "About", to: "/#about", icon: "i-lucide-user" },
    { label: "Experience", to: "/#experience", icon: "i-lucide-briefcase" },
    { label: "Education", to: "/#education", icon: "i-lucide-graduation-cap" },
    { label: "Skills", to: "/#skills", icon: "i-lucide-sparkles" },
    { label: "My Story", to: "/#my-story", icon: "i-lucide-book-open" },
    { label: "Projects", to: "/#projects", icon: "i-lucide-code" },
    { label: "Contact", to: "/#contact", icon: "i-lucide-mail" },
  ]);
  return { items };
};

// Items for the User Account Menu
export const useAccountMenu = () => {
  const items = computed(() => [
    [
      { label: "Download PDF", icon: "i-lucide-download", to: "/resume.pdf" },
      { label: "Email", icon: "i-lucide-mail", to: "/#contact" },
      { label: "Phone", icon: "i-lucide-phone", to: "tel:832-288-0014" },
    ],
  ]);
  return { items };
};
