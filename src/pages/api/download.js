import archiver from "archiver";
import fs from "fs"

export default async function handler(req, res) {

    const { method ,query} = req;
    
    if(method === 'GET'){

        var newdir = `${__dirname}`.split("\\")

        newdir.splice(-1)
        newdir = newdir.join('/').concat('/NotAnsweredQuestions')

    
        fs.readdir(newdir, (err, files) => {
            if (err) {
              res.status(404).json({error:'Error while reading directory'});
              return;
            }
        
            const textFiles = files.filter(file => file.endsWith('.txt'));
        
            if (textFiles.length === 0) {
              res.status(404).json({error:'No text files found in the directory'});
              return;
            }
            else{
              res.setHeader('Content-Type', 'application/zip');
              res.setHeader('Content-Disposition', 'attachment; filename=downloaded_files.zip');
          
              const archive = archiver('zip', {
                zlib: { level: 9 } // Set compression level
              });
          
              archive.pipe(res);
          
              textFiles.forEach(file => {
                archive.file(`${newdir}/${file}`||`${newdir}\\${file}`, { name: file });
              });
          
              archive.finalize();
            }
        
           
          });
    
    
    
    
    }
} 