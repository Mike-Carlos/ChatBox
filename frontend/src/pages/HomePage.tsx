import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";

const HomePage: React.FC = () => {

    return (
        <>
        <Navbar/>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    <ChatBox />
                </div>
            </div>
        </div>
        </>
    );
};

export default HomePage;
