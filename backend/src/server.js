const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({
            status: "healthy",
            database: "connected"
        });
    } catch (error) {
        res.status(500).json({
            status: "unhealthy",
            database: "disconnected"
        });
    }
});

app.get("/api/employees", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM employees ORDER BY id DESC"
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch employees"
        });
    }
});

app.get("/api/employees/search", async (req, res) => {
    try {
        const { name } = req.query;

        const [rows] = await pool.query(
            "SELECT * FROM employees WHERE name LIKE ?",
            [`%${name || ""}%`]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            error: "Search failed"
        });
    }
});

app.post("/api/employees", async (req, res) => {
    try {
        const {
            name,
            email,
            department,
            salary
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO employees
            (name, email, department, salary)
            VALUES (?, ?, ?, ?)`,
            [name, email, department, salary]
        );

        res.status(201).json({
            id: result.insertId,
            message: "Employee added successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to add employee"
        });
    }
});

app.put("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            department,
            salary
        } = req.body;

        await pool.query(
            `UPDATE employees
             SET name = ?, email = ?, department = ?, salary = ?
             WHERE id = ?`,
            [name, email, department, salary, id]
        );

        res.json({
            message: "Employee updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update employee"
        });
    }
});

app.delete("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM employees WHERE id = ?",
            [id]
        );

        res.json({
            message: "Employee deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete employee"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
});
