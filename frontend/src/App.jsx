import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        department: "",
        salary: ""
    });

    const loadEmployees = async () => {
        const response = await fetch("/api/employees");
        const data = await response.json();
        setEmployees(data);
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editingId
            ? `/api/employees/${editingId}`
            : "/api/employees";

        const method = editingId ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        setForm({
            name: "",
            email: "",
            department: "",
            salary: ""
        });

        setEditingId(null);

        loadEmployees();
    };

    const deleteEmployee = async (id) => {
        await fetch(`/api/employees/${id}`, {
            method: "DELETE"
        });

        loadEmployees();
    };

    const editEmployee = (employee) => {
        setEditingId(employee.id);

        setForm({
            name: employee.name,
            email: employee.email,
            department: employee.department,
            salary: employee.salary
        });
    };

    const searchEmployees = async () => {
        const response = await fetch(
            `/api/employees/search?name=${search}`
        );

        const data = await response.json();

        setEmployees(data);
    };

    return (
        <div className="container">
            <h1>Employee Management System</h1>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    name="department"
                    placeholder="Department"
                    value={form.department}
                    onChange={handleChange}
                    required
                />

                <input
                    name="salary"
                    type="number"
                    placeholder="Salary"
                    value={form.salary}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {editingId ? "Update Employee" : "Add Employee"}
                </button>
            </form>

            <div className="search">
                <input
                    placeholder="Search employee"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={searchEmployees}>
                    Search
                </button>

                <button onClick={loadEmployees}>
                    All Employees
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.department}</td>
                            <td>{employee.salary}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        editEmployee(employee)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteEmployee(employee.id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
