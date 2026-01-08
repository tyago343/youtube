import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { renderHook, type RenderHookOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import type { Store } from "@reduxjs/toolkit";
import store from "@core/store";

interface AllTheProvidersProps {
  children: React.ReactNode;
  store?: Store;
}

const AllTheProviders = ({
  children,
  store: customStore,
}: AllTheProvidersProps) => {
  const storeToUse = customStore || store;
  return (
    <Provider store={storeToUse}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { store?: Store }
) => {
  const { store: customStore, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders store={customStore}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

const customRenderHook = <T,>(
  hook: () => T,
  options?: Omit<RenderHookOptions<T>, "wrapper"> & { store?: Store }
) => {
  const { store: customStore, ...hookOptions } = options || {};
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <AllTheProviders store={customStore}>{children}</AllTheProviders>
    ),
    ...hookOptions,
  });
};

export { customRender as render, customRenderHook as renderHook };
