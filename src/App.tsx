import { Route, Routes } from "react-router";
import "./main.scss";
import { Navbar } from "./components/Navbar";
import { FontMaker } from "./apps/font-maker/FontMaker";
import { FontMakerServiceProvider } from "./apps/font-maker/services/ServiceProviders";
import { SegDispApp } from "./apps/segment/SegDispApp";
import { HidApp } from "./apps/hid/HidApp";
import { TimerCalcApp } from "./apps/timercalc/TimerCalcApp";

function App() {
  return (
    <>
      <Navbar />
      <div id="content">
        <Routes>
          <Route path="/" element={<>Hello</>} />
          <Route
            path="/fontmaker"
            element={
              <FontMakerServiceProvider>
                <FontMaker />
              </FontMakerServiceProvider>
            }
          />
          <Route path="/segdisp" element={<SegDispApp />} />
          <Route path="/hid" element={<HidApp />} />
          <Route path="/timercalc" element={<TimerCalcApp />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
