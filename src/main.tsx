import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async";

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
import { GoogleOAuthProvider } from "@react-oauth/google";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <HelmetProvider>

      <GoogleOAuthProvider clientId="125951477842-2tfiag4qd8fjinfoqcfiss78kjg1m24b.apps.googleusercontent.com">

    <React.StrictMode>
        <Suspense>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </Suspense>
    </React.StrictMode>
      </GoogleOAuthProvider>
      </HelmetProvider>

);

