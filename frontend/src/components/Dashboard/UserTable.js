import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const UserTable = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState();
  useEffect(() => {
    axios
      .get(`https://project5-deploy.onrender.com/count/alluser`)
      .then((result) => {
        console.log(result.data);
        setRows(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />

      <TableContainer component={Paper} className="table">
        <Table style={{ width: "70%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Row Number</TableCell>
              <TableCell className="tableCell">User Name</TableCell>
              <TableCell className="tableCell">Age</TableCell>
              <TableCell className="tableCell">Email</TableCell>
              <TableCell className="tableCell">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map((row, id) => (
                <TableRow key={id}>
                  <TableCell className="tableCell">{id + 1}</TableCell>
                  <TableCell className="tableCell">
                    <div
                      id={row.user_id}
                      style={{ cursor: "pointer" }}
                      className="cellWrapper"
                      onClick={(e) => {
                        const id = e.target.id;
                        console.log(">>>>", id);
                        navigate(`/profile/${id}`);
                      }}
                    >
                      <img
                        id={row.user_id}
                        className="friend-img"
                        src={
                          row.avatar ||
                          "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                        }
                      />
                      &nbsp; {row.username}
                    </div>
                  </TableCell>
                  <TableCell className="tableCell">{row.age}</TableCell>
                  <TableCell className="tableCell">{row.email}</TableCell>

                  <TableCell className="tableCell">
                    <span className={`status ${row.case}`}>
                      {row.case == "not" ? "not active user" : "active user"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserTable;
