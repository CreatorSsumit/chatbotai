import fs from "fs";
import path from "path";
import axios from "axios";

export default async function handler(req, res) {
  const { method, body: { data } } = req;

  

  if (method === 'POST') {

    if(data.type === 'questionanswer'){

    const filePath = path.join(__dirname, `${data.type}.json`);

    try {

        if (!fs.existsSync(filePath)) {
            // If the file doesn't exist, create it with an empty array
            fs.writeFileSync(filePath, '[]', 'utf-8');
          }

      // Read the existing data from the file
      let existingData = [];
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      if (fileContent.trim() !== '') {
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) {
          throw new Error('Existing data is not an array.');
        }
      }

    let  updated_data  = 
        {
            "question": data.question,
            "keyword1": data.keyword1,
            "keyword2":data.keyword2,
            "link": data.link,
            "answer": data.answer
          }
      

      existingData.push(updated_data);

      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

      res.json({ message: 'Data appended to the local file successfully.' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }else{
    axios.post(`http://chatbotpy.netlink.com/upload`,{
      "anchor_text": data.question,
      "anchor_link": data.link,
      "parent_url": data.link,
      "scripted_value": data.answer||"",
   }).then(e=>{
    if(e&&e.data){
      res.json({ message: 'Data appended to the Bert local file successfully.' });
    }
   }).catch(err=>{
    res.status(500).json({ error: 'Internal Server Error' });
   })
  }
}
}
