// in MessageParser.jsx
import React from "react";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {


     if (message?.toLowerCase() === "clear chat") {
      actions.clearChat();
    } else if(message?.trim()?.length !==0){
      actions?.questionList(message);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;
