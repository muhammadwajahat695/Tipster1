import React, { useState,useEffect } from "react";
import Footer from "../student/Footer";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import "./../../css/PendingRequests.css";
import RejectRequestPopup from "./RejectRequestPopup";
import deleteicon from "./../../icons/deleteicon.png";
import { useLocation,useNavigate } from "react-router-dom";

 
const FreezeSemesterForm = () => {
  const location=useLocation();
  const registrationId=location.state
console.log(registrationId);
// const [first, setfirst] = useState([])
// console.log("sfddsf",first)
const [freezeForm, setFreezeForm] = useState([])
  useEffect(() => {   
    //we can not use async function in useEffect
    FreezeForm();
    },[]);
    const FreezeForm= async()=>{
      try {
        const res= await fetch(`/Freeze_Form/${registrationId}`,{
          method: "GET",
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          },
          credentials:"include"
        });
  
        const data=await res.json();
        console.log(data);
        setFreezeForm(data);
  
        if(!res.status===200){
          const error =new Error(res.error);
          throw error;
        }
      } catch (error) {
        console.log(error);
        // navigate("");
      }
    } 

    const [reject, setReject] = useState({reason:""})
     
  const [buttonPopup, setButtonPopup] = useState(false);

  const submit=async(e)=>{
    e.preventDefault();
    const reason=reject
    const {registrationId}=FreezeForm
    const res = await fetch("/FreezeSemester_reject", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason:reason,
        registrationId
      })
    })
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("invalid credentials")
    } else {
      window.alert("Successfully reject the freeze semester request")
      setButtonPopup(false)
    }
  }
  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">Freeze Form</h2>
      </div>
      <div className="FreezeSemesterFormContainer">
        <form action="">
          <div className="credentials">
            <h3 className="formLabel">Name: </h3>
            <h3 className="formDataName">{freezeForm.name}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">Reg No:</h3>
            <h3 className="formData">{freezeForm.registrationId}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">Section:</h3>
            <h3 className="formData">{freezeForm.section}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">Email:</h3>
            <h3 className="formDataEmail">{freezeForm.email}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">CGPA:</h3>
            <h3 className="formDataCgpa">{freezeForm.CGPA}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">Contact:</h3>
            <h3 className="formDataContact">{freezeForm.contactNo}</h3>
          </div>
          <table className="FreezeSemesterTable">
            <tr>
              <th className="FreezeFormReason">Reason</th>
              <th className="FreezeTime">Continuation Semester</th>
              <th className="FreezeReject">Reject</th>
            </tr>
            <tr>
              <td className="FreezeFormReason">{freezeForm.reason}</td>
              <td className="FreezeTime">{freezeForm.continuationTime}</td>
              <td className="FreezeReject">
                <img
                  src={deleteicon}
                  alt=""
                  className="dropbtn"
                  onClick={() => setButtonPopup(true)}
                />
              </td>
            </tr>
          </table>
          <button className="FreezeAcceptBtn">Accept</button>
        </form>
      </div>
      <Footer />
      <RejectRequestPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form action="">
          <label htmlFor="" className="dropreasonlabel">
            Reason
          </label>
          <br />
          <textarea
            name="reason"
            value={reject.reason}
            onChange={(e)=>setReject(e.target.value)}
            className="dropreasoninput"
            placeholder="Enter a reason to reject this request"
            cols="40"
            rows="5"
            required
          ></textarea>
          <br />
          <button className="rejectBtn"
          onClick={submit}
          >Reject</button>
        </form>
      </RejectRequestPopup>
    </div>
  );
};

export default FreezeSemesterForm;
