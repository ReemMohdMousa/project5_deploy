import React, { useEffect } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBCardTitle,
  MDBCardLink,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import "./style.css";

import Comments from "../Comments";
import "bootstrap/dist/css/bootstrap.min.css";
import Posts from "../Posts/index";
import { useDispatch, useSelector } from "react-redux";
import { setHomePosts } from "../redux/reducers/posts/index";
import AddPost from "../AddPost";
import { MDBFile } from "mdb-react-ui-kit";
import { useNavigate, useParams } from "react-router-dom";
import HomePosts from "./HomePosts";
import { io } from "socket.io-client";
import { useSocket } from "../../App";
import OnlineUsers from "./OnlineUsers/OnlineUsers";
import { setLogout } from "../redux/reducers/auth";
import AllFriends from "../Profile/AllFriends";



export const getAllHomePosts = () => {
  axios
    .get(`https://project5-deploy.onrender.com/home/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      dispatch(setHomePosts(response.data.result));
    })
    .catch((err) => {
      console.log(err);
    });
};


const Home = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const socket = useSocket(io);

  //componant states
  const [onlineUsersArr, setOnlineUsersArr] = useState([]);

  //redux states

  const {
    posts,
    userinfo,
    token,
    userId,
    friends,
    homePosts,
    isPostFromHomeDeleted,
  } = useSelector((state) => {
    return {
      posts: state.posts.posts,
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
      friends: state.friends.friends,
      homePosts: state.posts.homePosts,
      isPostFromHomeDeleted: state.posts.isPostFromHomeDeleted,
    };
  });

  // get all the user's and his friends posts orderd DESC
   
  const [socketnotification, setSocketNotification] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.emit("NEW_USER", userId);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    getAllHomePosts();
  }, [isPostFromHomeDeleted]);

  useEffect(() => {
    console.log(socket);
    socket.on("RECEIVE_NOTIFICATION", (data) => {
      console.log("***********************************", data);
      setSocketNotification(data);
      // socket.on("eee", (data) => {
      //   console.log(data);
      // });

      // setNotification((pre)=>
      // {return [
      //   ...pre,
      //  data
      // ]});
    });
  }, []);

  useEffect(() => {
    socket?.on("SEND_USER", (OnlineUsers) => {
      setOnlineUsersArr(OnlineUsers);
    });
  }, [userId]);

  const notify = () => console.log(socketnotification);
  toast(({ data }) => `${data}`, {
    data: `${socketnotification && socketnotification?.messagecontent}`,
    icon: (
      <img
        style={{ width: "30px", height: "30px" }}
        src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"
      ></img>
    ),
  });
  // toast.(<p>{notification?.messagecontent}</p>,{
  //   position: "top-right",
  //   autoClose: 5000,
  //   hideProgressBar: true,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  //   theme: "light",
  // });
  socketnotification !== null && notify();

  return (
    <div>
      <div className="gradient-custom-2" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center  h-100">
            <MDBCol md="2">
              <MDBRow>
                <MDBCard className="home-card hide">
                  <MDBCardImage
                    position="top"
                    src={
                      userinfo && userinfo.avatar
                        ? userinfo.avatar
                        : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                    }
                    style={{ width: "150px", zIndex: "1", marginLeft: "15px" }}
                  />
                  <MDBCardBody>
                    <MDBCardTitle>
                      {" "}
                      {userinfo && userinfo.firstname}
                      {"  "}
                      {userinfo && userinfo.lastname}
                    </MDBCardTitle>
                    <MDBCardText>{userinfo && userinfo.bio}</MDBCardText>
                  </MDBCardBody>
                  <MDBListGroup flush>
                    <MDBListGroupItem
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <AllFriends id={userId} />
                    </MDBListGroupItem>
                  </MDBListGroup>
                  <MDBListGroup flush style={{ marginTop: "10px" }}>
                    <MDBListGroupItem
                      onClick={() => {
                        navigate(`/profile/${userId}`);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      View profile
                    </MDBListGroupItem>
                  </MDBListGroup>
                  <MDBCardBody>
                    <MDBCardLink
                      onClick={() => {
                        dispatch(setLogout());
                      }}
                      href="/"
                    >
                      Switch account
                    </MDBCardLink>
                  </MDBCardBody>
                </MDBCard>
              </MDBRow>
              <MDBRow style={{ marginTop: "15px" }}>
                <MDBCard className="home-card hide">
                  <MDBCardBody style={{ marginTop: "-8px" }}>
                    <h6
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      Active now
                    </h6>

                    <OnlineUsers onlineUsersArr={onlineUsersArr} />
                  </MDBCardBody>
                </MDBCard>
              </MDBRow>
            </MDBCol>
            <MDBCol lg="9" xl="7">
              <MDBCard>
                <MDBCardBody className="text-black p-4">
                  <MDBRow className="g-2">
                    <MDBCol className="mb-2">
                      <AddPost getAllHomePosts={getAllHomePosts} />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol className="mb-2">
                      {/* dispaly the posts */}
                      {homePosts &&
                        homePosts.map((elem) => {
                          return (
                            <HomePosts
                              post={elem}
                              socket={socket}
                              key={elem.post_id}
                            />
                          );
                        })}
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <div>
        {" "}
        {socketnotification && socketnotification ? (
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Home;
