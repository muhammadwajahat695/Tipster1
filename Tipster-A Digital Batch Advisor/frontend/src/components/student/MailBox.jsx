import React, { useState } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import "./../../css/MailBox.css";
import deleteicon from "./../../icons/deleteicon.png";
import { Link } from "react-router-dom";
import DeleteMessagePopup from "./DeleteMessagePopup";

const MailBox = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Mail Box</h2>
      </div>
      <div className="receivedmsgscontainer">
        <table style={{ width: "100%", marginLeft: "0px" }}>
          <tr>
            <th className="subjectCol">Subject</th>
            <th className="dateCol">Date</th>
            <th className="delCol">Delete</th>
          </tr>
          <tr>
            <td>
              <Link to="/QueryThread" className="subjectRow">
                How can I add my course?
              </Link>
            </td>

            <td className="tablerows">
              <Link to="/QueryThread" className="subjectRow">
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
      <Link to="/NewMessage">
        <button className="composebtn">
          <FontAwesomeIcon icon={faPlusSquare} className="composeicon" />
          Compose
        </button>
      </Link>
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

export default MailBox;