import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";


const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
  saveMessages,
  deleteConversation,
}) => {


  useEffect(() => {
    checkSession()
  }, [])


  const checkSession = ()=>{
     
    let messages = JSON.parse(sessionStorage.getItem('chat_messages'))||[{}]
     if(!window.checkSession){
      window.checkSession = setTimeout(() => {
        let currentMessages = JSON.parse(sessionStorage.getItem('chat_messages'))||[{}]
    
        if(messages?.length === currentMessages?.length){
         let sessionMessage =  createChatBotMessage("You still there? You havn't asked any question in past 20 mins.\nI will close this conversation.\nIf you need any help please feel free to Ask Wayne.")
          setState((prev) => {
            return {
              ...prev,
              messages: [...prev?.messages, sessionMessage],
            };
          });
         
          setTimeout(() => {
            window.checkSession = null;
            clearChat(()=>{
            window.parent.postMessage("hide_chatBot", "*");
            })
          }, 7000);
        }
                     
      }, 20 * 60 * 1000);
     }else{
      window.checkSession = null;
      checkSession()
     }
  }
  




  const questionList = (typedMsg) => {

     var message = "";
     let loading = createChatBotMessage(<Loader />);
     setState((prev) => {
      return {
        ...prev,
        messages: [...prev?.messages, loading],
      };
    });
     
     axios.get(`/api?typedmsg=${typedMsg}`).then(({data})=>{

      let greetingArr = [];

        if(data?.length) {

          if(data?.some(e=>e.type==='greeting')){
            data?.forEach(element => {
             let greetingMessage = createChatBotMessage(element?.answer||"Hi, I'm Wayne the virtual assistant. How can I assist you today?")
              greetingArr.push(greetingMessage)
            });
          }
          else{
            message = createChatBotMessage(`Here I found some relevant information you might be looking for... If this does not help, then please rephrase your question.`, {
              widget: "getAllQuestions",
              payload: data,
            });
            greetingArr.push(message)
          }


        } else {
          message = createChatBotMessage(`I'm Sorry, This question is too difficult for me. Could you please rephrase so I can try answering it again?`);
          greetingArr.push(message)
        }
    
        setState((prev) => {
          let filterData = prev.messages||[];
          filterData.pop()
          saveMessages([...filterData, ...greetingArr],()=>{
            checkSession()
          });
          return {
            ...prev,
            messages: [...filterData, ...greetingArr],
          };
        });


      }).catch(err=>{
       var errMsg = createChatBotMessage('Something went wrong');
       setState((prev) => {
        let filterData = prev.messages||[];
        filterData.pop()
        return {
          ...prev,
          messages: [...filterData, errMsg],
        };
      });
      })
  };

  const questionSelection = (data) => {
    var message = "";

    message = createChatBotMessage(data?.question, {
      widget: "getAllAnswer",
      payload: data,
    });

    setState((prev) => {
      saveMessages([...prev?.messages, message],()=>{
        checkSession()
      });
      return {
        ...prev,
        messages: [...prev?.messages, message],
      };
    });
  };

  const clearChat = (cb) => {
    deleteConversation(cb);
    
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            questionList,
            questionSelection,
            clearChat,
            checkSession
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
