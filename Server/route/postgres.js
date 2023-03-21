import express from 'express';
import cors from 'cors';
import bp from 'body-parser';
import http from 'http';
import { connect_to_pg, delete_request, insert_request, select_requests_withStatus, select_request_all, select_request_of_user, update_status } from '../modules/postgres.js';

export const app_postgres = express();
app_postgres.use(cors());
app_postgres.use(bp.json());
app_postgres.use(bp.urlencoded({ extended: true }));
var server = http.Server(app_postgres);
var password_admin = 'admin';

var protocol_denodo = 'http';
var ip = 'localhost';
var port_denodo = '9090';

app_postgres.get('/connect-postgres', (req, res) => {
    connect_to_pg()
    res.send('connected');
});

app_postgres.post('/insert-request', (req, res) => {
    connect_to_pg();
    var creation_date = ''+new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+'';
    req.body.ws.forEach(wsName => {
        var insertion = insert_request(String(req.body.username), wsName, creation_date, String(req.body.status), String(req.body.database))
    })
    res.send('Done');
});

app_postgres.get('/all-requests', (req, res) => {
    connect_to_pg();
    const users = select_request_all().then(function (results) {
        res.send(results);
    }
    );
});

app_postgres.get('/user-requests/:username', (req, res) => {
    connect_to_pg();
    const users = select_request_of_user(String(req.params.username)).then(function (results) {
        res.send(results);
    }
    );
});

app_postgres.get('/request-withStatus/:username/:status', (req, res) => {
    connect_to_pg();
    const users = select_requests_withStatus(String(req.params.username), String(req.params.status)).then(function (results) {
        res.send(results);
    }
    );
});

app_postgres.post('/update-user-requests', (req, res) => {
     connect_to_pg();
      //const users = update_status(String(req.params.username), String(req.params.wsName), String(req.params.status))    
      req.body.ws.forEach(wsName => { 
        var users = update_status(String(req.body.database_name), String(req.body.username), wsName, String(req.body.status),String(req.body.viewname)); 
    })
       res.send('Done');
    }
);

app_postgres.get('/delete-request/:username/:wsName/:status', (req, res) => {
    connect_to_pg();
    const users = delete_request(String(req.params.username), String(req.params.wsName), String(req.params.status))
    res.send('Done');
});