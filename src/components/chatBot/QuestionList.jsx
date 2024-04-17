import React, { useEffect, useState } from "react";
import { Button, Space ,Card } from "antd";
import axios from "axios";

function QuestionList({ state, payload, actionProvider, actions, ...rest }) {
  const [faqQuestion, setfaqQuestion] = useState([]);

  useEffect(() => {
    setfaqQuestion(payload);
  }, [payload]);


  const redirecturl = (data) => {
    axios.post('/api/',data).then(e=>{
      actionProvider.checkSession()
      window.open(data?.link || data?.newPageRouteLink||data.anchor_link, "_blank");
    })
  
  }

  return (
    <div style={{width: "100%", overflow: "hidden" }}>
      {faqQuestion?.map((e, i) => {
        return (
          <div key={i}>
               {(e?.answer||e?.scripted_value) && (e?.link || e?.newPageRouteLink||e?.anchor_link ) && <div key={i} style={{  overflow: "hidden" }}>
         <Card
          className="answercard"
          style={{
            marginTop: 10,
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            height: "auto",
            background:'#e8eff7'
          }}
        >
          <div>{(e?.answer||e?.scripted_value)}</div>
          {(e?.link || e?.newPageRouteLink||e?.anchor_link ) &&   <Button
              type="dashed"
              size="middle"
              style={{
                marginTop: 10,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                height: "auto",
                color: "#2491FF",
                borderColor: "#2491FF",
                background: "#E1F0FF",
              }}
              onClick={() => 
                redirecturl(e)
                // actionProvider?.questionSelection(e)
              }
            >
              {e?.question||e?.anchor_text}
            </Button>}
        </Card>
        </div>}

          {(e?.link || e?.newPageRouteLink||e?.anchor_link ) && !(e?.answer||e?.scripted_value) &&   <Button
              type="dashed"
              size="middle"
              style={{
                marginTop: 10,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                height: "auto",
                color: "#2491FF",
                borderColor: "#2491FF",
                background: "#E1F0FF",
              }}
              onClick={() => 
                redirecturl(e)
                // actionProvider?.questionSelection(e)
              }
            >
              {e?.question||e?.anchor_text}
            </Button>}
          </div>
        );
      })}
    </div>
  );
}

export default QuestionList;
