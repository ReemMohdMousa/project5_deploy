import React, { useState, useEffect, useRef } from "react";
import "./messenger.css";
import Conversation from "./Conversation/Conversation";
import Message from "./Message/Message";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setFriendInfo } from "../redux/reducers/Messenger/index";
import { io } from "socket.io-client";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import CurrentConversation from "./CurrentConversation";
import {
  setTheOpenedConversation,
  setConversations,
} from "../redux/reducers/Messenger/index";
import OnlineFriends from "./OnlineFriends/OnlineFriends";

const ENDPOINT = "https://project5-deploy.onrender.com";
//connect to the backend server
// const socket = io.connect(ENDPOINT);

const Messenger = () => {
  const navigate = useNavigate();

  //componant states
  // const [conversations, setConversations] = useState([]);
  // const [theOpenedConversation, setTheOpenedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newWrittenMessage, setNewWrittenMessage] = useState("");
  const [socket, setSocket] = useState(io(ENDPOINT, { autoConnect: false }));
  const [sending, setSending] = useState(false);
  const [receiving, setReceiving] = useState(false);
  const scrollRef = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friendInfo, setFriendInfo] = useState(null);

  const dispatch = useDispatch();

  const {
    userinfo,
    token,
    userId,
    conversationFriendInfo,
    openConversation,
    theOpenedConversation,
    conversations,
  } = useSelector((state) => {
    return {
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
      conversationFriendInfo: state.messenger.conversationFriendInfo,
      openConversation: state.messenger.openConversation,
      theOpenedConversation: state.messenger.theOpenedConversation,
      conversations: state.messenger.conversations,
    };
  });

  //connect to the backend server
  useEffect(() => {
    socket.connect();
    socket.emit("ADD_USER", userId);
  }, []);

  useEffect(() => {
    socket?.on("GET_MESSAGE", (data) => {
      console.log(data);
      setMessages([
        ...messages,
        {
          sender: data.sender_id,
          text: data.text,
          createdAt: Date.now(),
        },
      ]);
    });
    setReceiving(true);
  }, [messages]);

  // useEffect(() => {
  //   arrivedMessage &&
  //     theOpenedConversation?.members.includes(arrivedMessage.sender) &&
  //     setMessages((prev) => [...prev, arrivedMessage]);
  // }, [arrivedMessage, theOpenedConversation]);

  //get all user's conversations
  const getAllUserConversations = () => {
    axios
      .get(`https://project5-deploy.onrender.com/conversation/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        // console.log(response.data);
        dispatch(setConversations(response.data));
      })
      .catch(function (error) {
        throw error;
      });
  };

  //get the conversation messages
  const getAllConversationMessages = () => {
    const receiver_id = theOpenedConversation?.members.find(
      (member) => member != userId
    );

    theOpenedConversation &&
      axios
        .get(
          `https://project5-deploy.onrender.com/messages/${theOpenedConversation._id}/${receiver_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(function (response) {
          console.log(response.data);
          setMessages(response.data);
          setSending(true);
        })
        .catch(function (error) {
          throw error;
        });
  };

  const SendNewMsg = () => {
    // setCurrentUserId(userId);
    axios
      .post(
        `https://project5-deploy.onrender.com/messages`,
        {
          text: newWrittenMessage,
          sender: userId,
          conversationId: theOpenedConversation._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(function (response) {
        // console.log(response.data);
        const receiver_id = theOpenedConversation.members.find(
          (member) => member != userId
        );
        // console.log(theOpenedConversation);
        // console.log(receiver_id);
        socket.emit("SEND_MESSAGE", {
          sender_id: userId,
          receiver_id: receiver_id,
          text: newWrittenMessage,
        });
        setNewWrittenMessage("");
        setMessages([...messages, response.data]);
      })
      .catch(function (error) {
        throw error;
      });
  };

  const getFriendInfo = () => {
    const receiver_id = theOpenedConversation?.members.find(
      (member) => member != userId
    );
    theOpenedConversation &&
      axios
        .get(
          `https://project5-deploy.onrender.com/users/others/info/${receiver_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setFriendInfo(response.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    getAllUserConversations();
    getAllConversationMessages();
    getFriendInfo();
  }, [theOpenedConversation]);

  useEffect(() => {
    socket?.on("GET_USERS", (users) => {
      console.log(users);
      setOnlineUsers(users);
    });
  }, [userId]);

  // useEffect(() => {
  //   socket?.on("welcome", (msg) => {
  //     console.log(msg);
  //   });
  // }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
            <h4>your conversations</h4>
            {conversations?.map((element) => {
              return (
                <div
                  key={element._id}
                  onClick={() => {
                    dispatch(setTheOpenedConversation(element));

                    //determine the receiver_id
                    // const receiver_id = element.members.find(
                    //   (member) => member != userId
                    // );

                    //navigate to current conversation
                    // navigate(`/messenger/${userId}/${receiver_id}`);
                  }}
                >
                  <Conversation
                    Oneconversation={element}
                    theOpenedConversation={theOpenedConversation}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div>
              <h4>
                {theOpenedConversation &&
                  friendInfo &&
                  friendInfo?.firstname + " " + friendInfo?.lastname}
              </h4>
            </div>
            <>
              {theOpenedConversation ? (
                <div>
                  <div className="chatBoxTop">
                    {messages.map((element) => {
                      // console.log(element);
                      return (
                        <div>
                          <Message
                            message={element}
                            mine={element.sender == userId ? true : false}
                            theOpenedConversation={theOpenedConversation}
                            friendInfo={friendInfo}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="chatBoxBottom">
                    <input
                      className="chatMessageInput"
                      placeholder="write something..."
                      onChange={(e) => {
                        // console.log(e.target.value);
                        setNewWrittenMessage(e.target.value);
                      }}

                      // value={newMessage}
                    ></input>
                    <button className="chatSubmitButton" onClick={SendNewMsg}>
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="noConversationText">"Open a conversation"</div>
              )}
            </>
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <OnlineFriends onlineUsers={onlineUsers} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
