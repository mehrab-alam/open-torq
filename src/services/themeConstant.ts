import { ThemeSchema } from "@/types/schema";
import { lazy } from "react";
const NavBar = lazy(() => import("@/components/Marketing/LandingPage/NavBar/NavBar"));

export type PageThemeConfig = ThemeSchema;

export const DEFAULT_THEME: PageThemeConfig = {
  navBar: {
    component: NavBar,
    navigationLinks: [
      {
        title: "Courses",
        link: "/#courses",
      },
      {
        title: "Events",
        link: "/events",
      },
      {
        title: "Blog",
        link: "/blog",
      },
    ],
  },

  brand: {
    name: "Torqbit",
    logo: "/icon/torqbit.png",
  },

  darkMode: false,
  heroSection: {
    title: "Become a Coder Product Builder",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores rerum voluptatum perferendis autem veritatis nostrum. Libero aliquam dignissimos sunt voluptatum!",
    actionButtons: {
      primary: {
        label: "Go to Dashboard",
        link: "/dashboard",
      },
      secondary: {
        label: "Contact Us",
        link: "mailto:support@torqbit.com",
      },
    },
    banner: {
      lightPath: "/img/macbook-light.png",
      darkPath: "/img/macbook-dark.png",
      align: "bottom",
    },
  },
};

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject = value && typeof value === "object" && !Array.isArray(value);
    if (isObject) {
      return key;
    }
  })
  .filter(Boolean);
