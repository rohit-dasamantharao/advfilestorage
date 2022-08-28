"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
let aws = require('aws-sdk'), bodyParser = require('body-parser'), multer = require('multer'), multerS3 = require('multer-s3');
dotenv_1.default.config();
const app = (0, express_1.default)();
const s3 = new aws.S3({
    secretAccessKey: process.env.SECRETACCESKEY,
    accessKeyId: process.env.ACCESKEYID,
    region: process.env.REGION
});
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(express_1.default.static(__dirname + '/public'));
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        key: function (_, file, cb) {
            console.log(file);
            //File name date and file concatination
            let filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    })
});
//used by upload form
app.post('/upload', upload.array('upl', 25), function (req, res, next) {
    res.send({
        message: "Uploaded!",
        urls: req.files.map(function (file) {
            return { url: file.location, name: file.key, type: file.mimetype, size: file.size };
        })
    });
});
app.get('/getimage', function (req, res, next) {
    if (req.query.key != undefined) {
        const downloadParams = s3.GetObjectRequest = {
            Bucket: process.env.BUCKET,
            Key: req.query.key
        };
        s3.getObject(downloadParams, (error, data) => {
            if (error) {
                console.log(`name ${req.query.key}`);
                console.log(error);
                res.sendStatus(400);
                res.end();
            }
            else {
                res.send(data.Body);
                res.end();
            }
        });
    }
    else {
        res.sendStatus(400);
        res.end();
    }
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
//template from https://blog.logrocket.com/how-to-set-up-node-typescript-express/
