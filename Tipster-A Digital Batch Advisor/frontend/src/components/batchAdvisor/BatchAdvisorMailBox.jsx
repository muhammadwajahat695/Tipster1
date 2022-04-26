import React, { useState } from "react";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import Footer from "./../student/Footer";
import deleteicon from "./../../icons/deleteicon.png";
import { Link } from "react-router-dom";
import DeleteMessagePopup from "./../student/DeleteMessagePopup";
import "./../../css/BatchAdvisorQueryBox.css";

const BatchAdvisorMailBox = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">Query Box</h2>
      </div>
      <div className="receivedmsgscontainer">
        <table style={{ width: "100%", marginLeft: "0px" }}>
          <tr>
            <th className="stdRegCol">Reg. No</th>
            <th className="stdNameCol">Name</th>
            <th className="highlightedCol">Subject</th>
            <th className="dateCol">Date</th>
            <th className="delCol">Delete</th>
          </tr>
          <tr>
            <td className="highlightedRow">
              <Link to="/BatchAdvisorQueryThread" className="highlightedRow">
                FA18-BCS-141
              </Link>
            </td>
            <td className="highlightedRow">
              <Link to="/BatchAdvisorQueryThread" className="highlightedRow">
                Muhammad Waleed
              </Link>
            </td>
            <td>
              <Link to="/BatchAdvisorQueryThread" className="highlightedRow">
                How can I add my course?
              </Link>
            </td>
            <td className="tablerows">
              <Link to="/BatchAdvisorQueryThread" className="highlightedRow">
                23/10/2022 10:43 pm
              </Link>
            </td>
            <td className="tablerows">
              <img
                src={deleteicon}
                alt=""
                className="AddedCourseDelBtn"
                onClick={() => setButtonPopup(true)}
              />
            </td>
          </tr>
        </table>
      </div>
      <Footer />
      <DeleteMessagePopup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form action="">
          <h3 className="DeleteConfirmation">
            Are you sure you want to delete this query?
          </h3>
          <button className="DeleteAddedCourseButton ">Delete</button>
        </form>
      </DeleteMessagePopup>
    </div>
  );
};

export default BatchAdvisorMailBox;