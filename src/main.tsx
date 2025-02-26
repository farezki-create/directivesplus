
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Auth from './pages/Auth.tsx'
import ResetPassword from './pages/ResetPassword.tsx'
import FreeText from './pages/FreeText.tsx'
import GeneratePDF from './pages/GeneratePDF.tsx'
import MoreInfo from './pages/MoreInfo.tsx'
import Examples from './pages/Examples.tsx'
import FAQ from './pages/FAQ.tsx'
import Reviews from './pages/Reviews.tsx'
import { LanguageProvider } from './hooks/useLanguage.tsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/free-text',
    element: <FreeText />,
  },
  {
    path: '/generate-pdf',
    element: <GeneratePDF />,
  },
  {
    path: '/more-info',
    element: <MoreInfo />,
  },
  {
    path: '/examples',
    element: <Examples />,
  },
  {
    path: '/faq',
    element: <FAQ />,
  },
  {
    path: '/reviews',
    element: <Reviews />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </React.StrictMode>,
)
