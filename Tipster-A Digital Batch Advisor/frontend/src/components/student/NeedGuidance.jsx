import React, { useState,useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import back from "./../../icons/back.png";
import { Link,useNavigate } from "react-router-dom";
import "./../../css/GuidanceBox.css";

const NeedGuidance = () => {
  // const [needguide,setNeedguide]=useState({course:""})
  const [guide,setGuide]=useState([]);

  const submit=async (course)=>{

    console.log(course)
    const res=await fetch(`/needguidance/${course}`,{
      method:"GET",
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
      },
      credentials:"include"
    })
    const data=await res.json();
    console.log(data.length)
    if(!data){
      
      window.alert("invalid")
    }else{
      console.log(data)
      setGuide(data)
    }
   
    
    // if () {
    //   window.alert("invalid credentials")
    // } 
    // else {
    //   console.log("data",needguide)
    //   // window.alert(`Get course successfully`)
    //   // navigate("/WantToGuide")
    // }

  }

  useEffect(() => {   
  console.log(guide)
    },[guide]);
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="pastpapersdiv">
        <Link to="/GuidanceBox">
          <img src={back} alt="" className="backiconneed" />
        </Link>
        <h2 className="pastpaperstitle">Need Guidance</h2>
      </div>
      <div className="needguidancecontainer">
        {/* <form action="" method="GET"> */}
          <br />
          <label className="selectcourselabel" htmlFor="">
            Select Course
          </label>
          <br />
          <select className="selectcourseinput"
          name="course"
          onChange={(e)=>submit(e.target.value)}
          id="" placeholder="">
            <option value="" disabled selected hidden>
              Select the course in which you need help
            </option>
            <option value="Human Computer Interaction">
              Human Computer Interaction
            </option>
            <option value="Game Development">Game Development</option>
            <option value="Software Project Management">
              Software Project Management
            </option>
            <option value="Multivariable Calculus">
              Multivariable Calculus
            </option>
          </select>
        {/* </form> */}
      </div>
      <div className="needguidancetablecontainer">
        {(guide=="")?"no record found":
        <form action="" method="GET">
        <table className="needguidancetable">
          <tr>
        <th className="namecol">Name</th>
            <th className="emailcol">Email</th>
            <th className="emailcol">Contact No</th>
            </tr>
           {guide.map((guiding)=>(
            <tr>
            <td className="namecol">{guiding.name}</td>
            <td className="emailcol">{guiding.email}</td>
            <td>{guiding.contactNo}</td>
          </tr>
           ))
          }
        </table>
        </form>
}
      </div>
      <Footer />
    </div>
  );
};

export default NeedGuidance;
