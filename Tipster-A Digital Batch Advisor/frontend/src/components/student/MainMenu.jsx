import React from "react";
import "./../../css/MainMenu.css";
import home from "./../../icons/home.png";
import addcourse from "./../../icons/addcourse.png";
import repeatcourse from "./../../icons/repeatcourse.png";
import freezesemester from "./../../icons/freezesemester.png";
import degreeplanner from "./../../icons/degreeplanner.png";
import guidancebox from "./../../icons/guidancebox.png";
import pastpapers from "./../../icons/pastpapers.png";
import officehours from "./../../icons/officehours.png";
import mailbox from "./../../icons/mailbox.png";
import { Link } from "react-router-dom";

const MainMenu = () => {
  return (
    <div className="mainmenudiv">
      <Link to="/Home" className="homelink">
        <div className="homemenu">
          <img className="menuicon" src={home} alt="" />
          <h5 className="homemenuname">Home</h5>
        </div>
      </Link>
      <Link to="/AddCourse">
        <div className="addcoursemenu">
          <img className="menuicon" src={addcourse} alt="" />
          <h5 className="menuname">
            Add <br /> Course
          </h5>
        </div>
      </Link>
      <Link to="/RepeatCourse">
        <div className="repeatcoursemenu">
          <img className="menuicon" src={repeatcourse} alt="" />
          <h5 className="menuname">
            Repeat <br /> Course
          </h5>
        </div>
      </Link>
      <Link to="/FreezeSemester">
        <div className="freezesemestermenu">
          <img className="menuicon" src={freezesemester} alt="" />
          <h5 className="menuname">
            Freeze <br />
            Semester
          </h5>
        </div>
      </Link>
      <Link to="/DegreePlanner">
        <div className="degreeplannermenu">
          <img className="menuicon" src={degreeplanner} alt="" />
          <h5 className="menuname">
            Degree <br /> Planner
          </h5>
        </div>
      </Link>
      <Link to="/GuidanceBox">
        <div className="guidanceboxmenu">
          <img className="menuicon" src={guidancebox} alt="" />
          <h5 className="menuname">
            Guidance <br /> Box
          </h5>
        </div>
      </Link>
      <Link to="/PastPapers">
        <div className="pastpapersmenu">
          <img className="menuicon" src={pastpapers} alt="" />
          <h5 className="menuname">
            Past <br /> Papers
          </h5>
        </div>
      </Link>
      <Link to="/OfficeHours">
        <div className="officehoursmenu">
          <img className="menuicon" src={officehours} alt="" />
          <h5 className="menuname">
            Office <br /> Hours
          </h5>
        </div>
      </Link>
      <Link to="/MailBox">
        <div className="mailboxmenu">
          <img className="menuicon" src={mailbox} alt="" />
          <h5 className="menuname">
            Mail <br /> Box
          </h5>
        </div>
      </Link>
    </div>
  );
};

export default MainMenu;
