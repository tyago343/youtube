import { useContext } from "react";
import { SidebarContext, type SidebarContextValue } from "./sidebar.types";

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

/**
 * Optional hook for components that may or may not be within a SidebarProvider.
 * Returns null if used outside of a SidebarProvider.
 */
export function useSidebarOptional(): SidebarContextValue | null {
  return useContext(SidebarContext);
}
