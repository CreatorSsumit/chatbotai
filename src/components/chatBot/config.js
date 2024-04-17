// in the config
import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";
import { AiOutlineMinusCircle, AiOutlineDelete } from "react-icons/ai";
import QuestionList from "./QuestionList";
import { faqQuestion } from "../../pages/api/faqQuestion";
import AnswerList from "./AnswerList";
import { Tooltip } from "antd";

const botName = "Wayne";

const hideChatBox = () => {
  window.parent.postMessage("hide_chatBot", "*");
};

const config = {
  botName: botName,
  lang: "no",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#235789",
    },
    chatButton: {
      backgroundColor: "#235789",
    },
  },

  state: { faqQuestion, selectedCategories: "" },
  widgets: [
    {
      widgetName: "getAllQuestions",
      widgetFunc: (props) => <QuestionList {...props} />,
    },
    {
      widgetName: "getAllAnswer",
      widgetFunc: (props) => <AnswerList {...props} />,
    },
  ],
  initialMessages: [
    createChatBotMessage(`Hi, I'm ${botName} the virtual assistant. How can I assist you today?`),
  ],
  customComponents: {
    header: (props) => (
      <div className="chatHeader">
        <div> Conversation with {botName}</div>
        <div>
          <Tooltip title="minimize chatbot" placement="left">
            <AiOutlineMinusCircle
              className="chatBotHeaderIcon"
              onClick={hideChatBox}
            />
          </Tooltip>
          {/* &nbsp;
          <Tooltip title="Delete Conversation" placement="left">
            <AiOutlineDelete
              className="chatBotHeaderIcon"
              onClick={() => {
                props()?.props?.deleteConversation();
              }}
            />
          </Tooltip> */}
        </div>
      </div>
    ),
  },
};

export default config;
