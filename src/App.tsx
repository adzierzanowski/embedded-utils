import { Route, Routes } from "react-router"
import './main.scss'
import { Navbar } from "./components/Navbar"
import { FontMaker } from "./apps/font-maker/FontMaker"
import { FontMakerServiceProvider } from "./apps/font-maker/services/ServiceProviders"
import { SegDispApp } from "./apps/segment/SegDispApp"
import { HidApp } from "./apps/font-maker/hid/HidApp"

function App() {
  return (
    <>
      <Navbar />
      <div id="content">
        <Routes>
          <Route path="/" element={<>Hello</>}/>
          <Route path="/fontmaker" element={(
            <FontMakerServiceProvider>
              <FontMaker />
            </FontMakerServiceProvider>
          )} />
          <Route path="/segdisp" element={<SegDispApp />} />
          <Route path="/hid" element={<HidApp />} />
        </Routes>
      </div>
    </>
  )
}

export default App
