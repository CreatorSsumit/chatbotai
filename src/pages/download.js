import React from 'react'
import { Button, notification } from "antd";
import { DownloadOutlined } from '@ant-design/icons';

function Download() {

  const [api, contextHolder] = notification.useNotification();
  

  const downloadFile=()=>{
    fetch('/api/download/',{method:'GET'})
    .then((response) => {
      if(response.status!==200){
       return  response.json()
      }
      return response && response.blob(); // Convert the response to a Blob
    })
    .then((blob) => {

      if(blob.error){
        api.error({message:blob.error})
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NotAnsweredFiles.zip'; // Specify the filename
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error downloading ZIP file:', error);
    });
  }

  return (<>
    {contextHolder}
   <div style={{width:'100%',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
   <Button icon={<DownloadOutlined />} size='large' type='primary' onClick={downloadFile}>download all files</Button>
   </div>
    </>
  )
}

export default Download