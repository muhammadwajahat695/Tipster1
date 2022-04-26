import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import deleteicon from "./../../icons/deleteicon.png";
import TopMenu from "./TopMenu";
import DropReasonPopup from "./DropReasonPopup";
import "./../../css/Home.css";

const Home = () => {
  const [userData, setUserData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  // const navigate=useNavigate();
  useEffect(() => {
    const calltopmenu = async () => {
      try {
        const res = await fetch("/Home", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        setUserData(data);

        if (!res.status === 200) {
          // navigate("/StudentLogin")
          const error = new Error(res.error);
          throw error;
        }
      } catch (error) {
        console.log(error);
      }
    };
    calltopmenu();
  }, []);
const [drop,setDrop]=useState({reason:""})
const [drop1,setDrop1]=useState({courseName:""})

  const submit=async (e)=>{
    e.preventDefault();
    console.log(drop1)
    // console.log(drop1.courseName)
    const reason=drop
    const courseName=drop1
    // console.log(drop1.courseName)
    const res = await fetch("/dropCourse_Request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason:reason,
        courseName:courseName
      })
    })
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("invalid credentials")
    } else {
      window.alert("drop course request send")
      setButtonPopup(false)

    }

  }
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div>
        <div className="freezesemesterdiv">
          <h2 className="freezesemestertitle">Registered Courses</h2>
        </div>
        <table>
          <tr>
            <th className="column1">Course Code</th>
            <th className="column2">Course Title</th>
            <th className="column3">Credits</th>
            {/* <th className="column4">Section</th> */}
            <th className="column5">Status</th>
            <th className="column6">Drop</th>
          </tr>
          {userData.map((home) => (
            <tr>
              <td>{home.courseCode}</td>
              <td>{home.courseName}</td>
              <td>{home.credits}</td>
              {/* <td></td> */}
              <td>{home.status}</td>
              <td>
                <img
                  src={deleteicon}
                  alt=""
                  className="dropbtn"
                  onClick={() => {setButtonPopup(true);setDrop1(home.courseName)}}
                />
              </td>
            </tr>
          ))}
        </table>
      </div>
      <Footer />
      <DropReasonPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form action="" method="POST">
          <label htmlFor="" className="dropreasonlabel">
            Reason
          </label>
          <br />
          <textarea
            name="reason"
            value={drop.reason}
            onChange={(e)=>setDrop(e.target.value)}
            className="dropreasoninput"
            placeholder="Enter a valid reason to drop the course"
            cols="40"
            rows="5"
            required
          ></textarea>
          <br />
          <button className="newcontactbutton"
          onClick={submit}
          >Drop</button>
        </form>
      </DropReasonPopup>
    </div>
  );
};

export default Home;