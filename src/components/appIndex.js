import Config from "./chatBot/config";
import MessageParser from "./chatBot/MessageParser";
import ActionProvider from "./chatBot/ActionProvider";
import "react-chatbot-kit/build/main.css";
import dynamic from 'next/dynamic'

const Chatbot = dynamic(() => import('react-chatbot-kit'), { ssr: false })

function AppIndex() {


  const saveMessagestoLocal = (messages,callback) => {
    sessionStorage.setItem('chat_messages', JSON.stringify(messages));

    const localMessages = JSON.stringify(sessionStorage.getItem("chat_messages"));
    window.parent.postMessage(
      JSON.stringify(["sessionStorage_chatbot", localMessages]),
      "*"
    );
    callback && callback()
    
  };

  const deleteConversation = (callback) => {
    sessionStorage.removeItem('chat_messages');
    callback && callback()
    window.location.reload();
  };


  const loadMessages = () => {
    if( typeof window !=='undefined'){
    const messages = JSON.parse(sessionStorage.getItem('chat_messages'));
    return messages;
    }
  };

  return (
    <Chatbot
      config={Config}
      messageParser={MessageParser}
      validator={(value)=>value}
      actionProvider={(props) => (
        <ActionProvider
          {...props}
          saveMessages={saveMessagestoLocal}
          deleteConversation={deleteConversation}
        />
      )}
      messageHistory={loadMessages()}
    />
  );
}

export default AppIndex;






