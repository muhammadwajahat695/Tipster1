import React from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import back from "./../../icons/back.png";
import "./../../css/Pretest.css";
import { Link } from "react-router-dom";

const PretestInstructions = () => {
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">
          <Link to="/AddCourse">
            <img src={back} alt="" className="backToAddCourse" />
          </Link>
          Pre-Test
        </h2>
      </div>
      <div className="PretestInstructionsContainer">
        <div className="innerdiv">
          <form action="">
            <p className="prereqCode">
              <b> Course Code: </b>CSC101
            </p>
            <p className="prereqTitle">
              <b> Course Title:</b> Compiler Construction
            </p>
            <h3>Instructions:</h3>
            <p className="instructions">Total Questions: 10</p>
            <p className="instructions">Total Marks: 10</p>
            <p className="instructions">Total Time: 15 mins</p>
            <p className="instructions">Only one attempt!</p>
            <p className="instructions">One you start you cannot pause!</p>
            <Link to="/PretestQuestions">
              <button className="start-btn">Start</button>
            </Link>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PretestInstructions;
