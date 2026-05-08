import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';
import { HelmetProvider } from "react-helmet-async";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <React.StrictMode>
          <HelmetProvider>
              <Suspense
                fallback={
                  <div className="global-loader">
                    <div className="spinner"></div>
                  </div>
                }
              >
                  <Provider store={store}>
                      <RouterProvider router={router} />
                  </Provider>
              </Suspense>
          </HelmetProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
    </QueryClientProvider>
);

