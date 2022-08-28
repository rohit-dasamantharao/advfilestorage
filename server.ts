import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
let aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');

dotenv.config();

const app: Express = express();
const s3 = new aws.S3({
  secretAccessKey: process.env.SECRETACCESKEY,
  accessKeyId: process.env.ACCESKEYID,
  region: process.env.REGION
});

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        key: function (_:any, file:any, cb:any) {
            console.log(file);
            //File name date and file concatination
            let filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    })
});

//used by upload form
app.post('/upload', upload.array('upl', 25), function (req:any, res:any, next:any) {
    res.send({
			message: "Uploaded!",
			urls: req.files.map(function(file:any) {
				return {url: file.location, name: file.key, type: file.mimetype, size: file.size};
			})
		});
});

app.get('/getimage', function (req:Request, res:Response, next:any) {
  if(req.query.key != undefined){
    const downloadParams= s3.GetObjectRequest = {
      Bucket: process.env.BUCKET,
      Key: req.query.key
    };
    s3.getObject(downloadParams, (error:any, data:any) => {
      if (error) {
        console.log(`name ${req.query.key}`)
        console.log(error);
        res.sendStatus(400);
        res.end();
      }
      else
      {
        res.send(data.Body);
        res.end();
      }
    });
  }
  else{
    res.sendStatus(400);
    res.end();
  }
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});



//template from https://blog.logrocket.com/how-to-set-up-node-typescript-express/