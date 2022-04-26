import React, { Component } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import Loadable from "react-loadable";
import LoadingIndicator from "../TimetableImages/LoadingIndicator";
import "./../../css/DegreePlanner.css";

class DegreePlanner extends Component {
  state = { select: "" };
  render() {
    return (
      <div className="container">
        <TopMenu />
        <MainMenu />
        <div className="freezesemesterdiv">
          <h2 className="freezesemestertitle">Degree Planner</h2>
        </div>
        <div className="specializationTracksContainer">
          <form action="">
            {/* <label className="timetablelabel">Section</label> */}
            <select
              className="tracksinput"
              name=""
              id=""
              placeholder=""
              required
              onChange={(e) => {
                this.setState({ select: e.target.value });
              }}
            >
              <option value="" disabled selected hidden>
                Select Specialization Track
              </option>
              <option>Track I - Software Development</option>
              <option>Track II - Database Technologies</option>
              <option>Track III - Artificial Intelligence and Graphics</option>
            </select>
            <br />
          </form>
          <br />
          <div>{this.selectedImage(this.state.select)}</div>
        </div>
        <div className="recommendedCoursesContainer">
          <h2 className="RecommendationTitle">Recommended Courses</h2>
        </div>
        <Footer />
      </div>
    );
  }
  selectedImage(select) {
    const Component = this.loadComponent(select);
    return Component;
  }

  loadComponent(Type) {
    switch (Type) {
      case "Track I - Software Development":
        const SoftwareDevelopment = Loadable({
          loader: () =>
            import(
              "./../SpecializationTracks/SoftwareDevelopment/SoftwareDevelopment"
            ),
          loading: LoadingIndicator,
        });
        return <SoftwareDevelopment />;
      case "Track II - Database Technologies":
        const DatabaseTechnologies = Loadable({
          loader: () =>
            import(
              "./../SpecializationTracks/DatabaseTechnologies/DatabaseTechnologies"
            ),
          loading: LoadingIndicator,
        });
        return <DatabaseTechnologies />;
      case "Track III - Artificial Intelligence and Graphics":
        const AIandGraphics = Loadable({
          loader: () =>
            import("./../SpecializationTracks/AIandGraphics/AIandGraphics"),
          loading: LoadingIndicator,
        });
        return <AIandGraphics />;
      case "":
        return (
          <h2 className="noimg">
            Please select specialization track to view its courses!
          </h2>
        );

      default:
        return (
          <h2 className="noimg">
            An error has occured while loading the image!
          </h2>
        );
    }
  }
}

export default DegreePlanner;