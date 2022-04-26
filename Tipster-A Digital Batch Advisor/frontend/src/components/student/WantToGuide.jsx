import React,{useState,useEffect} from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import back from "./../../icons/back.png";
import deleteicon from "./../../icons/deleteicon.png";
import { Link,useNavigate } from "react-router-dom";
// import { map } from 'rxjs/operators';
import "./../../css/GuidanceBox.css";

const WantToGuide = () => {
  //for guide course
  // const [guide,setGuide]=useState({
  //   course:""
  // });
  
  // const handleInputs=(e)=>{
  //   let name,value;
  //   console.log(e);
  //   name=e.target.name;
  //   value=e.target.value;
  //   setGuide({...guide,[name]:value});
  // } 
  const navigate = useNavigate();
  const submit = async (course) => {
    // e.preventDefault();
    // const {course}=guide;
    const res = await fetch(`/want-to-guide/${course}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      course
      })
    })
    const data = res.json();
  
    if (res.status === 400 || !data) {
      window.alert("invalid credentials")
    } else {
      window.alert("course updated")
      navigate("/WantToGuide")
    }
  }

//get the data
  const [coursedata, setCourseData] = useState([]);
  const wanttoguide= async()=>{
    try {
      const res= await fetch("/guide_courses",{
        method: "GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        credentials:"include"
      });

      const data=await res.json();
      console.log(data);
      
      setCourseData(data);

      if(res.status===400){
        const error =new Error(res.error);
        throw error; 
      }
    } catch (error) {
      console.log(error);
      navigate("/WantToGuide");
    }
  }
//   const [check,setCheck]=useState("")
//   if(coursedata===""){
//     setCheck(false)
//     // console.log(abc)
// }
// // else if(coursedata[0].contactNo==="--"){
// //   setCheck(false)
// // }
// else{
//   setCheck(true)
// }
  //checkbox
    const [checked,setChecked]=useState("uncheck")
  const checkbox= async (add)=>{
    if(add===""||add==="uncheck"){
      add="check"
      setChecked(add)
      // setCheck(false)
      // console.log(add)
    }else{
    add="uncheck"
    setChecked(add)
    // setCheck(true)
    console.log(add)
  }
  
  const res = await fetch(`/wantToGuide_contact/${add}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
    add
    })
  })
  const data = res.json();
  if (res.status === 400 || !data) {
    console.log("first")
    // window.alert("invalid credentials")
  } else {
    // window.alert("course updated")
    navigate("/WantToGuide")
  }
}
  useEffect(() => {   
    //we can not use async function in useEffect
    wanttoguide();
    },[]);
   

  //for delete courses
  const delcourse = async (course) => {
    // e.preventDefault();
    // const {course}=deletecourse;
    const res = await fetch(`/delete_course/${course}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      course
      })
    })
    const data = res.json();
  
    if (res.status === 400 || !data) {
      window.alert("invalid credentials")
    } else {
      window.alert(`delete ${course} successfully`)
      navigate("/WantToGuide")
    }
  }
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="pastpapersdiv">
        <Link to="/GuidanceBox">
          <img src={back} alt="" className="backiconwant" />
        </Link>
        <h2 className="pastpaperstitle">Want to Guide?</h2>
      </div>
      <div className="wanttoguidecontainer">
        <form action="" method="POST">
          <br />
          <label className="courselabel" htmlFor="">
            Course 1
          </label>
          <br />
          <select className="courseinput" id="" 
          name="course"
          // value={guide.course}
          // onChange={handleInputs}
          onChange={(e)=>submit(e.target.value)}
          placeholder="" required>
            <option value="" disabled selected hidden>
              Select Course 1
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
          <br />
          <input type="checkbox" className="contactcheckbox" 
          // checked={check}
          name=""
          value={checked}
          onChange={(e)=>checkbox(e.target.value)}
          // checked={checked}
          // onChange={() => setChecked(toggle)}
         // onChange={(e)=>addcontact(e.target.value)}
          />
          <label htmlFor="" className="contactcheckboxlabel">
            I also want to share my phone number
          </label>
          {/* <br />
          <button className="wanttoguidebutton"
          onClick={guide_course}>
            Submit
            </button> */}
        </form>
      </div>
      <div className="guidancetablecontainer">
        {(coursedata==="")?"no record found":
        <form action="" method="GET">
        <table className="wanttoguidetable">
              <tr>
                <th className="coursecol">Course Title</th>
                <th className="delcol">Delete</th>
              </tr>
          {coursedata.map((courses)=>(
            <tr>    
          <td className="row"
          name="course"
          >{courses.course}
          </td>
          <td className="row">
          <img src={deleteicon} 
          onClick={()=>delcourse(courses.course)}
          alt="" className="delbtn" />
          </td>
          </tr>
          ))}
           </table> 
         </form>
}
      </div>
      <Footer />
    </div>
  );
};

export default WantToGuide;
