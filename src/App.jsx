
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import GitWrappedApp from "./pages/LandingPage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <GitWrappedApp /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
