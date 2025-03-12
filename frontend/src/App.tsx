import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import 'bootstrap';
import HomePage from "./pages/HomePage";


const App = () =>{
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
      </Routes>
    </Router>

  );
};
export default App;