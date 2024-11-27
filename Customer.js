import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Customer = () => {
    const [customerList, setCustomerList] = useState([]);
    const [canEdit, setCanEdit] = useState(false);
    const [canView, setCanView] = useState(false);
    const [canAdd, setCanAdd] = useState(false);
    const [canRemove, setCanRemove] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserAccess();
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await fetch("http://localhost:3001/Customer");
            if (!response.ok) {
                throw new Error(`Failed to fetch customers. Status: ${response.status}`);
            }
            const data = await response.json();
            setCustomerList(data);
        } catch (error) {
            toast.error(`Error loading customers: ${error.message}`);
        }
    };

    const fetchUserAccess = async () => {
        const userRole = sessionStorage.getItem("userrole") || "";

        try {
            const response = await fetch(
                `http://localhost:3001/roleaccess?role=${userRole}&menu=Customer`
            );

            if (!response.ok) {
                toast.warning("You are not authorized to access this page");
                navigate("/");
                return;
            }

            const data = await response.json();

            if (data && data.length > 0) {
                setCanView(true);
                const access = data[0];
                setCanEdit(access.haveedit);
                setCanAdd(access.haveadd);
                setCanRemove(access.havedelete);
            } else {
                toast.warning("You are not authorized to access this page");
                navigate("/");
            }
        } catch (error) {
            toast.error(`Error fetching access: ${error.message}`);
            navigate("/");
        }
    };

    const handleAdd = () => {
        if (canAdd) {
            toast.success("Add operation successful!");
        } else {
            toast.warning("You do not have permission to add.");
        }
    };

    const handleEdit = () => {
        if (canEdit) {
            toast.success("Edit operation successful!");
        } else {
            toast.warning("You do not have permission to edit.");
        }
    };

    const handleRemove = () => {
        if (canRemove) {
            toast.success("Remove operation successful!");
        } else {
            toast.warning("You do not have permission to remove.");
        }
    };

    if (!canView) {
        return <h2>Loading...</h2>; // Prevent rendering if view access is not granted
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h3>Customer Listing</h3>
                </div>
                <div className="card-body">
                    <button onClick={handleAdd} className="btn btn-success">
                        Add (+)
                    </button>
                    <br />
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerList.length > 0 ? (
                                customerList.map((item) => (
                                    <tr key={item.code}>
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <button
                                                onClick={handleEdit}
                                                className="btn btn-primary"
                                                disabled={!canEdit}
                                            >
                                                Edit
                                            </button>{" "}
                                            |
                                            <button
                                                onClick={handleRemove}
                                                className="btn btn-danger"
                                                disabled={!canRemove}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Customer;