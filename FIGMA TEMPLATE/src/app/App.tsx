import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Home } from "../pages/Home"
import { Features } from "../pages/Features"
import { Demo } from "../pages/Demo"
import { Docs } from "../pages/Docs"
import { Contact } from "../pages/Contact"
import { ThemeProvider } from "../components/ThemeProvider"
import { Toaster } from "sonner"

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="demo" element={<Demo />} />
            <Route path="docs" element={<Docs />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}
