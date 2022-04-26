import React from "react";
import "./../../css/MainMenu.css";
import { Link } from "react-router-dom";

const BatchAdvisorMainMenu = () => {
  return (
    <div className="mainmenudiv">
      <Link to="/PendingRequests" className="BAmenuslink">
        <h3 className="BAmenus">Pending Requests</h3>
      </Link>
      <Link to="/ApprovedRequests" className="BAmenuslink">
        <h3 className="BAmenus">Approved Requests</h3>
      </Link>
      <Link to="/Timetable" className="BAmenuslink">
        <h3 className="BAmenus">Timetable</h3>
      </Link>
      <Link to="/BatchAdvisorOfficeHours" className="BAmenuslink">
        <h3 className="BAmenus">Office Hours</h3>
      </Link>
      <Link to="/StudentsInformation" className="BAmenuslink">
        <h3 className="BAmenus">My Batch Students</h3>
      </Link>
      <Link to="/BatchAdvisorMailBox" className="BAmenuslink">
        <h3 className="BAmailboxmenu">Query Box</h3>
      </Link>
    </div>
  );
};

export default BatchAdvisorMainMenu;