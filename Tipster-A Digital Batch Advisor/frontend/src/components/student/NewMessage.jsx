import React from "react";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import Footer from "./Footer";
import "./../../css/StudentProfile.css";
import "./../../css/ChangePassword.css";
import { Link } from "react-router-dom";
import "./../../css/NewMessage.css";

const NewMessage = () => {
  return (
    <div className="stdpasswordcontainer">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">New Message</h2>
      </div>
      <div className="stdpasswordformdiv">
        <form action="">
          <label className="subjectlabel" htmlFor="">
            Subject
          </label>
          <br />
          <input className="subjectinput" type="text" required />
          <br />
          <label className="descriptionlabel" htmlFor="">
            Description
          </label>
          <br />
          <textarea
            name=""
            className="descriptioninput"
            cols="30"
            rows="8"
            required
          ></textarea>
          <br />
          <Link to="/MailBox">
            <button className="cancelbutton">Cancel</button>
          </Link>
          <button className="sendbutton">Send</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default NewMessage;
