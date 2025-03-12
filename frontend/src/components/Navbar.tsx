import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService, { getUserInfo } from "../services/authService";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    
    useEffect(() => {
            const fetchUser = async () => {
                try {
                    const userData = await getUserInfo();
                    setUsername(userData.username);
                } catch (error) {
                    navigate("/login"); // Redirect if not authenticated
                }
            };
            fetchUser();
        }, [navigate]);
    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };
    
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/home">Home</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collabpse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {username? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-light">Hello, {username}!</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;