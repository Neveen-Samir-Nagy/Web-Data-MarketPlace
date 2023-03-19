import express from 'express';
import cors from 'cors';
import bp from 'body-parser';
import http from 'http';
import { access_privilege, catalog_permissions, connect_denodo, create_api, create_datasource, create_remoteTable, create_user, drop_user, list_roles, list_users, map_users_ws, redploy_ws, revoke_user, webservices } from '../modules/VQL_denodo.js';

export const app_vql = express();
app_vql.use(cors());
app_vql.use(bp.json());
app_vql.use(bp.urlencoded({ extended: true }));
var server = http.Server(app_vql);
var password_admin = 'admin';
var protocol_denodo = 'http';
var ip = 'localhost';
var port_denodo = '9090';

app_vql.get('/connect-denodo/:user/:pass/:database', (req, res) => {
    var flag = connect_denodo(String(req.params.user), String(req.params.pass), String(req.params.database )).then(function (results) {
        console.log(results);
        res.send(results);

    });
});

app_vql.get('/catalog_permissions/:user', (req, res) => {
    const users_elemns = catalog_permissions(String(req.params.user)).then(function (results) {
        res.send(results);
    }
    );
});

app_vql.get('/webcontainer_services/:user', (req, res) => {
    const final_ws = webservices(String(req.params.user)).then(function (results) {
        res.send(results);
    });
});

app_vql.get('/create-api/:databaseName/:viewName', (req, res) => {
    create_api(String(req.params.databaseName), String(req.params.viewName), 'ws_' + String(req.params.viewName));
});

app_vql.get('/create-user/:user/:password', (req, res) => {
    create_user(String(req.params.user), String(req.params.password));
    res.send('Done');
});

app_vql.post('/create-datasource', (req, res) => {
    connect_denodo('admin',password_admin,'admin');
    const database = create_datasource(String(req.body.databaseName), String(req.body.datasourceType), String(req.body.datasourceName), String(req.body.driverClass), String(req.body.url), String(req.body.user), String(req.body.pass), String(req.body.classPath), String(req.body.database), String(req.body.version), parseInt(String(req.body.timeout))).then(function (results) {
        console.log(results);
        res.send(results[0].status);
    });
});

app_vql.get('/create-remoteTable/:remoteTableName/:database_source/:data_source/:database_view/:view', (req, res) => {
    connect_denodo('admin', password_admin, 'admin')
    const database = create_remoteTable(String(req.params.remoteTableName), String(req.params.database_source), String(req.params.data_source), String(req.params.database_view), String(req.params.view))
    res.send('Done');
});

app_vql.get('/access-privilege/:databaseName/:viewName/:wsName/:userName', (req, res) => {
    const database = access_privilege(String(req.params.databaseName),String(req.params.viewName), String(req.params.wsName), String(req.params.userName))
        //var responce = download(req, res, JSON.parse(results).elements, String(req.params.filename));
        res.send('Done');
});

app_vql.get('/redploy-ws/:wsName', (req, res) => {
    const database = redploy_ws(String(req.params.wsName))
        //var responce = download(req, res, JSON.parse(results).elements, String(req.params.filename));
        res.send('Done');
});

app_vql.get('/list-users', (req, res) => {
    connect_denodo('admin', password_admin, 'admin')
    const users = list_users().then(function (results) {
        console.log(results);
        res.send(results);
    }
    );
});

app_vql.get('/list-roles', (req, res) => {
    connect_denodo('admin', password_admin, 'admin')
    const users = list_roles().then(function (results) {
        console.log(results);
        res.send(results);
    }
    );
});

app_vql.get('/map-users-ws', (req, res) => {
    connect_denodo('admin', password_admin, 'admin')
    const users = map_users_ws().then(function (results) {
        console.log(results);
        res.send(results);
    }
    );
});

app_vql.get('/revoke-user/:databaseName/:wsName/:userName', (req, res) => {
    connect_denodo('admin', password_admin, 'admin')
    const users = revoke_user(String(req.params.userName), String(req.params.databaseName), String(req.params.wsName));
        res.send("Done");
    }
);

app_vql.get('/drop-user/:userName', (req, res) => {
    connect_denodo('admin', password_admin, 'admin');
    const users = drop_user(String(req.params.userName));
        res.send("Done");
    }
);