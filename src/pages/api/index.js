import fs from "fs"
import path from "path";
import moment from "moment";
import  greetings  from "./greeting.json";
import axios from "axios";


export default async function handler(req, res) {


  const filePath = path.join(__dirname, 'api', 'questionanswer.json');
  const dirPath = path.dirname(filePath);


  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
}

  const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

  const { method ,query,body} = req;

  
  const formattedDate = moment(new Date()).format('DD-MM-YYYY');
  const currentTime = moment(new Date()).format("LTS");
 
  if(method === 'GET'){
   const typedMsg =  await query?.typedmsg;


   const findnonRelevent =(questions,keywords)=>{

    questions = questions.map(item => ({
      question: item.question,
      keyword1: item.keyword1 && [new RegExp(item.keyword1.slice(0, -2),'i')] ||[],
      keyword2: item.keyword2 &&  [new RegExp(item.keyword2.slice(0, -2),'i')]||[],
      link: item.link || "",
      answer: item.answer || ""
    }))


    return questions.filter((e) => {
  return e?.[keywords]?.some((e1) => {
  return typedMsg
  ?.split(/(\s+)/)
  ?.filter(function (e) {
  return e.trim()?.length > 0;
  })
  .join(" ")
  ?.match(e1,"i");
  })  
  }).map(e=>({...e,keyword1:e.keyword1[0] && e.keyword1[0].source + '/i'||"",keyword2:e.keyword2[0]&&e.keyword2[0].source + '/i'||""}))
  }


 const greetingList =   greetings.filter((e) => {
         return e?.keywords?.map(key=>key?.replace(/\s+/g, ' ')?.trim()?.toLowerCase())?.includes(typedMsg?.replace(/\s+/g, ' ')?.trim()?.toLowerCase());
    });


    var data = [],
    nonReleventList = [jsonData],
    keyword = {
      0:'keyword1',
      1:'keyword2'
    }


    for (let i = 0; i < Object.keys(keyword)?.length; i++) {
      if(nonReleventList[i]?.length){
       let temp =  findnonRelevent(nonReleventList[i],keyword[i]);
       if(temp.length)
        nonReleventList.push(temp)
      }else{
       nonReleventList.push([])
      }
     
   }

   if(greetingList?.length){
    data = greetingList;
  }else{
      data = nonReleventList.pop();
 }


 const saveFilesFormat = (data)=>{
  var str = `${formattedDate},${currentTime} -- `

  str = str.concat("Asked Question - "+typedMsg+"\n"+"\tOptions Provided -"+"\n")
  data.forEach(e=>{
    let link = (e.link||e.anchor_link) && " link - " +(e.link||e.anchor_link)+"\n"||"";
    let options =  e.type==='greeting' ? e.answer: e.question||e.anchor_text;
   str = str.concat("\t"+ " . "+ options +" , "+link)
  })

  saveFilesToLocal('AnsweredQuestions',str.concat(data?.some(e=>e.type==='greeting')?"\n\n":"\n"))
  res.status(200).json(data)
 }

  if(data?.length){
    saveFilesFormat(data)
   
  }else{


    axios.get(`http://chatbotpy.netlink.com/get?msg=${typedMsg}`).then(e=>{
      if(e.data && e.data.data.length){
        saveFilesFormat(e.data.data)
      }else{
        let data = `${formattedDate},${currentTime},${typedMsg} , \n`;
        saveFilesToLocal('NotAnsweredQuestions',data) 
        res.status(200).json(e.data.data) 
      }

    })



 
}}

if(method==='POST' && body){
  var str = `${formattedDate},${currentTime} -- `
  str = str.concat("Selected Question - "+body.question+ " , link - "+body.link+"\n\n") 
    saveFilesToLocal('AnsweredQuestions',str)  
}

function saveFilesToLocal(localdirname,data){
    const formattedDate = moment(new Date()).format('DD-MM-YYYY');
    const directory = `${__dirname}\\${localdirname}`.split("\\").join("/")
    const fileName = path.join(directory,`${formattedDate}.txt`)

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
}

try {
    fs.appendFile(fileName, data, (error) => {
      if (error) {
        res.status(500).json({ data:[],error });
      } else {
        res.json({data:[],success:true});
      }
    });
  } catch (error) {
    res.json({data:[],err:error});
  }
}



}
