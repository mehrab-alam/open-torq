import { DEEP_OBJECT_KEYS, DEFAULT_THEME, PageThemeConfig } from "@/services/themeConstant";
import { createContext, ReactElement, ReactNode, useContext, useRef } from "react";

const ThemeConfigContext = createContext<PageThemeConfig>(DEFAULT_THEME);

export const useThemeConfig = () => useContext(ThemeConfigContext);

export function ThemeConfigProvider({
  value,
  children,
}: {
  value: PageThemeConfig;
  children: ReactNode;
}): ReactElement {
  const storeRef = useRef<PageThemeConfig>();
  storeRef.current ||= {
    ...DEFAULT_THEME,
    ...(value &&
      Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          value && typeof value === "object" && DEEP_OBJECT_KEYS.includes(key)
            ? // @ts-expect-error -- key has always object value
              { ...DEFAULT_THEME[key], ...value }
            : value,
        ])
      )),
  };

  return <ThemeConfigContext.Provider value={storeRef.current}>{children}</ThemeConfigContext.Provider>;
}
