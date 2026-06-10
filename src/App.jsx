import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import "./App.css"


function App() {
  return (
    <div>
      <Header />
        <Outlet />
      <Footer />
    </div>
  );
}

export default App;