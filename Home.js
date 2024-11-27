import { useEffect, useState } from "react";
import {Link,useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerList = async () => {
            const jwttoken = sessionStorage.getItem('jwttoken');

            if (!jwttoken) {
                // Redirect to login if token is missing
                navigate('/Login');
                return;
            }

            try {
                const response = await fetch("http://localhost:3001/customer", { // Changed to HTTP
                    headers: {
                        'Authorization': 'Bearer ' + jwttoken
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/Login'); // Redirect to login on unauthorized
                    }
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }

                const data = await response.json();
                if (data && data.length > 0) {
                    setCustomerList(data);
                } else {
                    setCustomerList([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerList();
    }, [navigate]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error: {error}</h2>;
    }

    return (
        <div>
            <h1 className="text-center">Welcome to Nihira Techies</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Credit Limit</th>
                    </tr>
                </thead>
                <tbody>
                    {customerList.length > 0 ? (
                        customerList.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.creditLimit}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No customers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Home;