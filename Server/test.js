// server.js where your app starts

// init project
import express  from "express";
import bodyParser from "body-parser";
import {spawn} from 'child_process';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//  res.sendFile(`${__dirname}/public/index.html`);
// });

app.get("/python", (request, response) => {
      // Reading Python files
      var dataToSend;
      // spawn new child process to call the python script
      const python = spawn('python', ['script.py', "hi", "Duyen"]);

     // collect data from script
     python.stdout.on('data', function (data) {
      dataToSend = data.toString();
     });

     python.stderr.on('data', data => {
      console.error(`stderr: ${data}`);
     });

     // in close event we are sure that stream from child process is closed
     python.on('exit', (code) => {
     console.log(`child process exited with code ${code}, ${dataToSend}`);
     console.log("data from python", dataToSend);
     response.send(dataToSend);
    }); 
});

// listen for requests :)
var listener = app.listen(3001, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
