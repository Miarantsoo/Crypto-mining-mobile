import React from 'react';
import { createRoot } from 'react-dom/client';
import { browserRouter } from './route/Route';
import { RouterProvider } from 'react-router-dom';

const router = browserRouter;

const container = document.getElementById('root');
createRoot(container!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);