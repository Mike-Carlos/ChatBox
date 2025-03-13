import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import authService from "../services/authService";


const Login: React.FC = () => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleLogin = async(e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const response = await authService.login({ username, password });
        if (response.token) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("username", username);
            navigate("/home");
            console.log("Navigating to home...");
        } else {
            setError("Invalid login response");
        }
        console.log("username: ", username)
    }

    return(
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4">
                        <h3 className="text-center">Login</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;