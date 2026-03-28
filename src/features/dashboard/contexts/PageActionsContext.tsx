import React, { createContext, useContext, useState } from "react";

interface PageActionsContextValue {
  actions: React.ReactNode;
  setActions: (node: React.ReactNode) => void;
}

const PageActionsContext = createContext<PageActionsContextValue>({
  actions: null,
  setActions: () => {},
});

export function PageActionsProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<React.ReactNode>(null);
  return (
    <PageActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </PageActionsContext.Provider>
  );
}

export function usePageActions() {
  return useContext(PageActionsContext);
}
