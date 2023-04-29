import React, { useState, useEffect } from "react";
import "./message.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import moment from "moment";

const Messages = ({ mine, message, friendInfo }) => {
  //dispatch
  const dispatch = useDispatch();

  const { userinfo, token, userId } = useSelector((state) => {
    return {
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
    };
  });

  return (
    <div>
      <div className={mine ? "my message" : "message"} key={message._id}>
        <div className="messageTop">
          <img
            className="messageImg"
            src={
              mine && userinfo
                ? userinfo.avatar
                : friendInfo && friendInfo.avatar 
            }
            alt="img"
          />
          <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">
          {moment(`${message.createdAt}`).fromNow()}
        </div>
      </div>
    </div>
  );
};

export default Messages;
