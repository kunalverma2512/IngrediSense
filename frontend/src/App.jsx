import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ServicesPage from './pages/ServicesPage'
import FAQPage from './pages/FAQPage'
import GalleryPage from './pages/GalleryPage'
import DocsPage from './pages/DocsPage'
import DashboardPage from './pages/DashboardPage'
import GuidelinesPage from './pages/GuidelinesPage'
import ScanPage from './pages/ScanPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="guidelines" element={<GuidelinesPage />} />
        <Route path="scan" element={<ScanPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
