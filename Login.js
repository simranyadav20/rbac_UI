import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Clear session storage on component mount
        sessionStorage.clear();
    }, []);

    const ProceedLogin = (e) => {
        e.preventDefault(); // Prevent the default form submission
        if (validate()) {
            const inputObj = {
                username: username,
                password: password
            };

            fetch("http://localhost:3000/user", { // Use HTTP for local development
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputObj)
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((resp) => {
                    if (Object.keys(resp).length === 0) {
                        toast.error('Login failed, invalid credentials');
                    } else {
                        toast.success('Login successful');
                        sessionStorage.setItem('username', username);
                        sessionStorage.setItem('jwttoken', resp.jwtToken);
                        navigate('/'); // Navigate to the home page after successful login
                    }
                })
                .catch((err) => {
                    toast.error('Login Failed due to: ' + err.message);
                });
        }
    };

    const validate = () => {
        let result = true;
        if (username === '' || username === null) {
            result = false;
            toast.warning('Please Enter Username');
        }
        if (password === '' || password === null) {
            result = false;
            toast.warning('Please Enter Password');
        }
        return result;
    };

    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6" style={{ marginTop: '100px' }}>
                <form onSubmit={ProceedLogin} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>User Name <span className="errmsg">*</span></label>
                                <input 
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="form-control"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Password <span className="errmsg">*</span></label>
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="form-control"
                                    required 
                                />
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Login</button> |
                            <Link className="btn btn-success" to={'/register'}>New User</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;