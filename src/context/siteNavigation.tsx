import { createContext, useContext } from "react";

type NavigateToSection = (id: string) => void;

export const SiteNavigationContext = createContext<NavigateToSection>(() => {});

export function useSiteNavigation() {
  return useContext(SiteNavigationContext);
}
