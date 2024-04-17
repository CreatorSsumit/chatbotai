import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Space, Spin, Tooltip, Typography,notification } from 'antd';
import axios from 'axios';
import questionanswer from "./api/questionanswer.json"
const { Option } = Select;



const UploadData = () => {
  const [form] = Form.useForm();
  const [type, setType] = useState("questionanswer")
  const  [loading, setloading] = useState(false)


  const onFinish = (values) => {

    let data  = {}

    if(values.type==="questionanswer"){
    data =   {

        "question": values.question,
        "keyword1": values.keyword1?.length !==0 && values.keyword1.join("|").concat('/i')||"",
        "keyword2":values.keyword2?.length !==0  && values.keyword2.join("|").concat('/i')||"",
        "link": values.link,
        "answer":values.answer||"",
        "type":values.type
    
      }
    }else{
     data =  {
        "question": values.question,
        "link": values.link,
        "type":values.type,
        "answer":values.answer||""
        }
    }

  setloading(true)
  

  axios.post('/api/upload',{data}).then(e=>{
   notification.success({message:e.data.message});
   setloading(false)
   form.resetFields();
  }).catch((err)=>{
    setloading(false)
  })


};

  return(
    // <Spin spinning={loading} size='small' >
      <Form
    form={form}
    name="complex-form"
    onFinish={onFinish}
    // labelCol={{ span: 0}}
    style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}
  >
    <Spin spinning={loading} size='small'>
    {/* <Form.Item label="Search Question">
    <Form.Item
          name={['search']}
          noStyle
         
        >
          <Select style={{width:'100vh'}} placeholder="Search Question if needs to be Update">
          <Option value="">Select</Option>
            <Option value="Zhejiang">Zhejiang</Option>
            <Option value="Jiangsu">Jiangsu</Option>
          </Select>
        </Form.Item>
        </Form.Item> */}

        <Form.Item label="Select Type of Question">
    <Form.Item
          name={'type'}
          noStyle
          rules={[{ required: true, message: 'type is required' }]}
        >
          <Select  onChange={(e)=>setType(e)} style={{width:'100vh'}} placeholder="Select Type of Question">
          <Option value="">Select</Option>
            {/* <Option value="greeting">Greeting</Option> */}
            <Option value="questionanswer">React Question Answer Json</Option>
            <Option value="learn">Bert Question Answer Json</Option>
          </Select>
        </Form.Item>
        </Form.Item>
    <Form.Item label="Question">
      
        <Form.Item
          name="question"
          noStyle
          rules={[{ required: true, message: 'question is required' }]}
        >
          <Input style={{ width: '100vh' }} placeholder="Please input" />
        </Form.Item>
    </Form.Item>
    <Form.Item label="Link">
    
        <Form.Item
          name="link"
        >
          <Input style={{ width: '100vh' }} placeholder="Please input link" />
        </Form.Item>
   
    </Form.Item>
  { type === "questionanswer" &&  <Form.Item label="Add matching tags">
   <Row gutter={16}>
    <Col md={12} span={24}>
    <Form.Item label="Keyword1">
        <Form.Item
          name='keyword1'
          mode="tags"
          rules={[{ required: true, message: 'first level keywords is required' }]}
        >
           <Select mode="tags"  style={{ width: '100%' }} placeholder="First Level Keywords"/>
   
        </Form.Item>
        </Form.Item>
        </Col>
        <Col md={12} span={24}>
           <Form.Item label="Keyword2">
        <Form.Item
          name='keyword2'
          mode="tags"
          rules={[{ required: true, message: 'first level keywords is required' }]}
         >
           <Select mode="tags" style={{ width: '100%' }} placeholder="Second Level Keywords"/>
        </Form.Item>
        </Form.Item>
        </Col>
        </Row>
    </Form.Item>}
    <Form.Item label="answer">
        <Form.Item
          name='answer'
        >
           <Input  style={{ width: '100%' }} placeholder="Enter Answer"/>
   
        </Form.Item>
        </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
    </Spin>
  </Form>
    // </Spin>
  )
};

export default UploadData;