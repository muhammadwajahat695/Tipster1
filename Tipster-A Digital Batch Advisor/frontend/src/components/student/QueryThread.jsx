import React from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import "./../../css/MailBox.css";
import { Link } from "react-router-dom";
import back from "./../../icons/back.png";
import sendMessage from "./../../icons/sendMessage.png";

const QueryThread = () => {
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">
          <div>
            <Link to="/MailBox">
              <img src={back} alt="" className="backToInbox" />
            </Link>
            Mail Box
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
export default QueryThread;
