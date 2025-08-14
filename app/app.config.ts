//app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet", // e.g., "blue", "emerald", "rose", etc.
      neutral: "stone", // e.g., "gray", "slate", "stone", "neutral"
    },
  },
  uiPro: {
    pageAside: {
      slots: {
        root:
          "hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-var(--ui-header-height))] lg:sticky lg:top-(--ui-header-height) py-8 lg:ps-4 lg:-ms-4 lg:pe-6.5",
        container: "relative",
        top: "sticky -top-8 -mt-8 pointer-events-none z-[1]",
        topHeader: "h-8 bg-default -mx-4 px-4",
        topBody:
          "bg-default relative pointer-events-auto flex flex-col -mx-4 px-4",
        topFooter: "h-8 bg-gradient-to-b from-default -mx-4 px-4",
      },
    },
    blogPosts: {
      base: "flex flex-col gap-8 lg:gap-y-16",
      variants: {
        orientation: {
          horizontal: "sm:grid sm:grid-cols-2 lg:grid-cols-3",
          vertical: "",
        },
      },
    },
  },
});
