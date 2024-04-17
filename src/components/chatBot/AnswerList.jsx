import React, { useEffect, useState } from "react";
import { Card } from "antd";

function AnswerList({ state, payload, actionProvider, actions, ...rest }) {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(payload);
  }, [payload]);

  const redirecturl = (e) => {
    e.preventDefault();
    actionProvider.checkSession()
    // sessionStorage.removeItem('chat_messages')
    window.open(data?.link || data?.newPageRouteLink, "_blank");
  };

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div>
        <Card
          style={{
            marginTop: 10,
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            height: "auto",
          }}
        >
          {data?.answer||data?.question?.split(" ")?.slice(0,5)?.join(" ")?.concat("...")}
          <br />
          {(data?.link || data?.newPageRouteLink) && (
            <div
              style={{ color: "#2491ff", cursor: "pointer" }}
              onClick={redirecturl}
            >
              Click to view details
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AnswerList;
