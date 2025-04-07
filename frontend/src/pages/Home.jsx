import { Link } from "react-router-dom";
// page to link all pages.
function Home() 
{
    return (
        <div className="auth-container">
            <h1>Authentication App</h1>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/register"><button>Register</button></Link>
            <Link to="/forgot-password"><button>Forgot Password</button></Link>
            <Link to="/register-with-face"><button>Register With Face</button></Link>
        </div>
    );
}

export default Home;
