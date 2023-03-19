import express from 'express';
import cors from 'cors';
import bp from 'body-parser';
import http from 'http';
import { app_postgres } from './route/postgres.js';
import { app_dc } from './route/dc_apis.js';
import { app_vql } from './route/VQL_denodo.js';

const app = express();
const port = 3000;
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use('/', [app_postgres, app_dc, app_vql]);
var server = http.Server(app);
var password_admin = 'admin';

var protocol_denodo = 'http';
var ip = 'localhost';
var port_denodo = '9090';

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
});

