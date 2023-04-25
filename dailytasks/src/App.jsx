import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Header } from "./components/Header";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
