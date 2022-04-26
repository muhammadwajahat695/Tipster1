import React from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import back from "./../../icons/back.png";
import "./../../css/Pretest.css";
import { Link } from "react-router-dom";

const PretestQuestions = () => {
  return (
    <>
      <div className="pretestdiv">
        <h2 className="freezesemestertitle">Pre-Test</h2>
      </div>
      <div className="Pretest-questions-container">
        
        <div className="question-container">
          <h3>Q1: HCI stands for?</h3>
          <input type="radio" name="abc" className="select" />
          <label htmlFor="" className="choice">
            Human Computer Interaction
          </label>
          <br />
          <input type="radio" name="abc" className="select" />
          <label htmlFor="" className="choice">
            Human Computer Interface
          </label>
          <br />
          <input type="radio" name="abc" className="select" />
          <label htmlFor="" className="choice">
            Human Class Interface
          </label>
          <br />
          <input type="radio" name="abc" className="select" />
          <label htmlFor="" className="choice">
            Human Computer Information
          </label>
        </div>

        <div className="submit-btn-container">
          <button className="start-btn">Submit</button>
        </div>
      </div>
    </>
  );
};

export default PretestQuestions;
