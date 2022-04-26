import React from "react";
import Footer from "../student/Footer";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import "./../../css/MailBox.css";
import { Link } from "react-router-dom";
import back from "./../../icons/back.png";
import sendMessage from "./../../icons/sendMessage.png";

const BatchAdvisorQueryThread = () => {
  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">
          <div>
            <Link to="/BatchAdvisorMailBox">
              <img src={back} alt="" className="backToInbox" />
            </Link>
            Query Box
          </div>
        </h2>
      </div>
      <div className="msgthreadcontainer">
        <p className="subjectHeading">
          <b>Subject:</b> The sdjkdskds kadjkdjsdks
        </p>
        <div>
          <div className="Sent">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident,
            enim.
            <br />
            <p className="time">12:33 pm</p>
          </div>
        </div>
        <div>
          <div className="Received">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Accusantium consectetur commodi tempora voluptatum magni neque.
            lorem
            <br />
            <p className="time">12:33 pm</p>
          </div>
        </div>
      </div>
      <div className="msgTextAreaContainer">
        <form action="">
          <textarea
            name=""
            id=""
            cols="100"
            rows="1"
            className="msgTextArea"
          ></textarea>
          <img src={sendMessage} alt="" className="sendMessageIcon" />
        </form>
      </div>
      <Footer />
    </div>
  );
};
export default BatchAdvisorQueryThread;