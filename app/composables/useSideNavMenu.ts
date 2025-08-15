export const useSideNavMenu = () => {
    const items = ref([
        [
            {
                label: "Component Quick Links",
                type: "label",
            },
            {
                label: "General Components",
                icon: "i-lucide-box",
                active: false,
                defaultOpen: false,
                children: [
                    {
                        label: "Badge",
                        icon: "i-lucide-file-box",
                        to: "#badge",
                    },
                    {
                        label: "Button",
                        icon: "i-lucide-file-box",
                        to: "#button",
                    },
                    {
                        label: "Accordian",
                        icon: "i-lucide-file-box",
                        to: "#accordian",
                    },
                    {
                        label: "Carousel",
                        icon: "i-lucide-file-box",
                        to: "#carousel",
                    },
                    {
                        label: "Collapsible",
                        icon: "i-lucide-file-box",
                        to: "#collapsible",
                    },
                    {
                        label: "Blog Post",
                        icon: "i-lucide-file-box",
                        to: "#blogpost",
                    },
                    {
                        label: "Tabs",
                        icon: "i-lucide-file-box",
                        to: "#tabs",
                    },
                ],
            },
            {
                label: "Page Components",
                icon: "i-lucide-book-open",
                active: false,
                defaultOpen: false,
                children: [
                    {
                        label: "Page Feature",
                        icon: "i-lucide-file-box",
                        to: "#pagefeature",
                    },
                    {
                        label: "Page Logos",
                        icon: "i-lucide-file-box",
                        to: "#pagelogos",
                    },
                    {
                        label: "Page Marquee",
                        icon: "i-lucide-file-box",
                        to: "#pagemarquee",
                    },
                    {
                        label: "Testimonials",
                        icon: "i-lucide-file-box",
                        to: "#testimonials",
                    },
                    {
                        label: "Page Card",
                        icon: "i-lucide-file-box",
                        to: "#pagecard",
                    },
                ],
            },
            {
                label: "Pricing Components",
                icon: "i-lucide-database",
                active: false,
                defaultOpen: false,
                children: [
                    {
                        label: "Pricing Plans",
                        icon: "i-lucide-file-box",
                        to: "#pricingplans",
                    },
                    {
                        label: "Pricing Table",
                        icon: "i-lucide-file-box",
                        to: "#pricingtable",
                    },
                ],
            },
        ],
        [
            {
                label: "Nuxt UI Pro",
                icon: "i-simple-icons-nuxt",
                badge: "3.0",
                to: "https://ui.nuxt.com/components/app",
                target: "_blank",
            },
            {
                label: "Help",
                icon: "i-lucide-circle-help",
                disabled: true,
            },
        ],
    ]);

    return { items };
};
