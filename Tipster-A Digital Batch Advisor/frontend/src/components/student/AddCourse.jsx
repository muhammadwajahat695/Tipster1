import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import "./../../css/AddCourse.css";
import deleteicon from "./../../icons/deleteicon.png";
import { Link } from "react-router-dom";
// import DeleteAddedCoursePopup from "./DeleteAddedCoursePopup";

const AddCourse = () => {
  // const [buttonPopup, setButtonPopup] = useState(false);
  const [addcourse, setAddcourse] = useState({courseName:"",courseCode:"",credits:"",section_to:"",reason:""})
  let name,value;
  const handleInputs=(e)=>{
    console.log(e);
    name=e.target.name;
    value=e.target.value;
    setAddcourse({...addcourse,[name]:value});
    // setCredit({...abc,[name]:value})
  }
  const [addcourses, setAddcourses] = useState([])
  const add=async(e)=>{
    e.preventDefault();
    let j="";
    for (let i=0;i<addcourses.length;i++){
      if(addcourses[i].courseName===addcourse.courseName){
        j=i
        window.alert("course already added")
      }
    }
    if(j===""){
      setAddcourses([...addcourses,abc])
  }
  }
  const delete1 =async(courseName)=>{
    for (let i=0;i<addcourses.length;i++){
      if(addcourses[i].courseName===courseName){
        console.log("dsdsadsa",addcourses[i].courseName)
        await addcourses.splice(i,1)
        setAddcourses([...addcourses])
      }
    }
  } 
//get courses that student can add
const [courses, setcourses] = useState([])
const S_courses= async()=>{
  try {
    const res= await fetch("/courses_that_added",{
      method: "GET",
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
      },
      credentials:"include"
    });

    const data=await res.json();
    console.log(data);
    setcourses(data);

    if(!res.status===200){
      const error =new Error(res.error);
      throw error;
    }
  } catch (error) {
    console.log(error);
    // navigate("/StudentLogin");
  }
}
const [abc, setCredit] = useState({credits:"",courseCode:"",courseName:"",pretest:"",Pre_req_Course:""})
// const [courseCode, setCourseCode] = useState("")
if(addcourse.courseName!==""){
  if(abc.credits===""||abc.courseCode==="" || abc.courseName!==addcourse.courseName ){

    for(let i=0;i<courses.length;i++){
      if(addcourse.courseName===courses[i].courseName){
        if(addcourse.courseName==="Introduction to ICT"||
           addcourse.courseName==="English Comprehension and Composition" ||
           addcourse.courseName==="Islamic Studies" ||
           addcourse.courseName==="Calculus and Analytic Geometry" ||
           addcourse.courseName==="Applied Physics for Engineers" ||
           addcourse.courseName==="Discrete Structures" ||
           addcourse.courseName==="Programming Fundamentals" ||
           addcourse.courseName==="Professional Practices for IT" ||
           addcourse.courseName==="Electricity, Magnetism and Optics" ||
           addcourse.courseName==="Digital Logic Design" ||
           addcourse.courseName==="Pakistan Studies" ||
           addcourse.courseName==="Linear Algebra" ||
           addcourse.courseName==="Statistics and Probability Theory" ||
           addcourse.courseName==="Software Engineering Concepts" ||
           addcourse.courseName==="Data Communications and Computer Networks" ||
           addcourse.courseName==="Human Computer Interaction" ||
           addcourse.courseName==="Introduction to Management" ||
           addcourse.courseName==="Introduction to Psychology"){
        let Pretest="N/A"
        let Pre_req_Course="N/A"  
        let credits=courses[i].credits
        let courseCode=courses[i].courseCode
        let courseName=courses[i].courseName 
        setCredit({...abc,credits,courseCode,courseName,Pretest,Pre_req_Course})
        }else{
          let Pretest="Available"
          let Pre_req_Course=""
          let credits=courses[i].credits
          let courseCode=courses[i].courseCode
          let courseName=courses[i].courseName 
          setCredit({...abc,credits,courseCode,courseName,Pretest,Pre_req_Course})
        }

        console.log(abc,"skdsdks")
      }
    }
  }

}

useEffect(() => {   
  //we can not use async function in useEffect
  S_courses();
  },[]);

return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Add Course</h2>
      </div>
      <div className="AddCourseFormContainer">
        <form action="">
          <select
            className="CourseTitleandReasonInput"
            name="courseName"
            value={addcourse.courseName}
            onChange={handleInputs}
            id=""
            placeholder=""
            required
          >
            <option value="" disabled selected hidden>
              Course Title
            </option>
            {courses.map((course)=>(
            <option>{course.courseName}</option>
            ))}
            {/* <option>Human Computer Interaction</option>
            <option>Game Development</option>
            <option>Software Project Management</option>
            <option>Compiler Construction</option> */}
          </select>
          <input
            className="CourseCodeandCreditsInput"
            type="text"
            name="courseCode"
            value={abc.courseCode}
            onChange={handleInputs}
            id=""
            placeholder="Course Code"
            readOnly
          />
          <input
            className="CourseCodeandCreditsInput"
            name="credits"
            value={abc.credits}
            onChange={handleInputs}
            type="text"
            placeholder="Credits"
            readOnly
          />
          <select
            className="CourseTitleandReasonInput"
            name="section_to"
            value={addcourse.section_to}
            onChange={handleInputs}
            id=""
            placeholder=""
            required
          >
            <option value="" disabled selected hidden required>
              Concerned Section
            </option>
            <option>FA18-BCS-A</option>
            <option>FA18-BCS-B</option>
          </select>
          <textarea
            className="AddReasonInput"
            name="reason"
            value={addcourse.reason}
            onChange={handleInputs}
            id=""
            cols="36.5"
            rows="4"
            placeholder="Enter Valid Reason"
            required
          ></textarea>
          <button className="Addbutton"
          onClick={add}
          >Add</button>
        </form>
      </div>
    
      <div className="AddCourseTableContainer">
      {(addcourses=="")?"no courses registered":
        <form action="">
          <table className="AddCourseTable">
            <tr>
              <th className="CourseCodeColumn">Course Code</th>
              <th className="CourseTitleColumn">Course Title</th>
              <th className="CreditsColumn">Credits</th>
              <th className="SectionColumn">Section</th>
              <th className="PrereqCourseColumn">Pre-req Course</th>
              <th className="PretestColumn">Pre-test</th>
              <th className="DeleteColumn">Delete</th>
            </tr>
            {addcourses.map((add)=>(
            <tr>
            <td>{add.courseCode}</td>
            <td>{add.courseName}</td>
            <td>{add.credits}</td>
            <td>{add.section_to}</td>
            <td>{add.Pre_req_Course}</td>
            <td><Link to="/PretestInstructions">{add.Pretest}</Link></td>
            <td>
              <img
                src={deleteicon}
                alt=""
                className="AddedCourseDelBtn"
                onClick={() => 
                  // {setButtonPopup(true);
                  delete1(add.courseName)
                // }
              }
              />
            </td>
          </tr>
            ))}

          </table>
          <br />
          <label className="FeeChallanLabel">Paid Fee Challan: </label>
          <input type="file" name="" id="" accept="image/*" />
          <br />
          <button className="AddCourseSubmitButton">Submit</button>
        </form>
      }
</div>

      {/* <DeleteAddedCoursePopup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form action="">
          <h3 className="DeleteConfirmation">
            Are you sure you want to delete this course?
          </h3>
          <button className="DeleteAddedCourseButton ">Delete</button>
        </form>
      </DeleteAddedCoursePopup> */}
      <Footer />
    </div>
  );
};

export default AddCourse;