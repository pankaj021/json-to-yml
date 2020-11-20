const express = require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const fs = require("fs")
const morgan = require("morgan")
const convertJsonToYml = require('./parser');
let REQ_COUNT = 0;
let TIMESTAMP;

const app = express()

app.use(fileUpload({
  createParentPath: true
}))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use((req, res, next) => { // for concurrent requests generate filenames 
  REQ_COUNT++;
  TIMESTAMP = new Date().getTime();
  if(!req.body.jsonPath){
    req.body.jsonPath = "./uploads/" + REQ_COUNT + "_" + TIMESTAMP + ".json"
  }
  console.log("filename:::::::", req.body.jsonPath);
  next()
})

app.post("/parse", async (req, res) => {
  try {
    if(!req.files){
      res.send({
        status: false,
        message: "No files"
      })
    } else {
      const {jsonFile} = req.files
      console.log("Got jsonFile::::::::::::::::::");
      jsonFile.mv(req.body.jsonPath)
      console.log("file uploaded::::::::::::::::::");
      convertJsonToYml(req.body.jsonPath)
      .then((yml) => {
        console.log("Json is coverted into yml:::::::::::::::");
        res.send({
          status: true,
          message: "File is uploaded",
          yml: yml
        })
        fs.unlink(req.body.jsonPath, function(err){
          if(err) return console.error('Could not delete the file', req.body.jsonPath);
          console.log('file deleted successfully...........');
        });  
      })
      .catch(err => {
        console.error("Error:::::::::::::::::", err);
        res.status(500).send(e.message)
      })
    }
  } catch (e) {
    res.status(500).send(e)
  }
})

const port = process.env.PORT || 4000

app.listen(port, () => console.log(`Server is running on port ${port}`))