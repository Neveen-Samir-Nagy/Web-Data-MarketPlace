import { sync_vdp_datacatalog, connect_denodo, create_api, get_ws_url, ws_details, sample_data, views, view_columns, view_details, catalog_permissions, webcontainer_services, webservices, create_datasource, create_remoteTable, access_privilege, redploy_ws, sample_data_from_ws, sample_data_link_ws, openApi, connection_details, sample_data_link_ws_pm, create_user, tages, list_users, list_roles, map_users_ws } from './index.js';
import express from 'express';
import cors from 'cors';
import bp from 'body-parser';
import http from 'http';

const app = express();
var denododb;
const port = 3000;
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
var server = http.Server(app);
var password_admin = 'admin';

var protocol_denodo = 'http';
var ip = 'localhost';
var port_denodo = '9090';

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
});

app.get('/connect-denodo/:user/:pass/:database', (req, res) => {
    var flag = connect_denodo(String(req.params.user), String(req.params.pass), String(req.params.database )).then(function (results) {
        console.log(results);
        res.send(results);

    });
});

app.get('/catalog_permissions/:user', (req, res) => {
    const users_elemns = catalog_permissions(String(req.params.user)).then(function (results) {
        res.send(results);
    }
    );
});

app.get('/webcontainer_services/:user', (req, res) => {
    const final_ws = webservices(String(req.params.user)).then(function (results) {
        res.send(results);
    });
});

app.get('/sync', (req, res) => {
    sync_vdp_datacatalog().then(function (results) {
        //console.log(results);
        res.send(results);
    });
});

app.get('/categories', (req, res) => {
    const categories = categories(1, '//'+ip+':9999/admin').then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});

app.get('/tages', (req, res) => {
    const tages = tages(1, '//'+ip+':9999/admin').then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});

app.get('/views/:databaseName/:limit/:offest', (req, res) => {
    const view = views(1, '//'+ip+':9999/admin', String(req.params.databaseName), parseInt(req.params.limit), parseInt(req.params.offest)).then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});

app.get('/view-details/:databaseName/:viewName', (req, res) => {
    const view_detail = view_details(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.viewName)).then(function (results) {
        //console.log(results);
        //console.log(Object.getOwnPropertyNames(JSON.parse(results)));
        res.send([results]);
    }
    );
});

app.get('/ws-details/:databaseName/:wsName', (req, res) => {
    const view_detail = ws_details(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.wsName)).then(function (results) {
        //console.log(results);
        //console.log(Object.getOwnPropertyNames(JSON.parse(results)));
        res.send([results]);
    }
    );
});

app.get('/view-columns/:databaseName/:viewName', (req, res) => {
    const view_column = view_columns(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.viewName)).then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});


app.get('/sample-data/:databaseName/:wsName/', (req, res) => {
    const data = sample_data_link_ws(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.wsName)).then(function (results) {
        //console.log(results);
        var samples = []
        if (typeof results === 'undefined') {
            return;
        }
        if (results.length != 0) {
            results = JSON.parse(results).elements.slice(0,10)
            samples.push(Object.getOwnPropertyNames(results[0]));
            results.forEach(element => {
                samples.push(Object.values(element));
            });
        }
        res.send(samples);
    }
    );
});

app.get('/create-api/:databaseName/:viewName', (req, res) => {
    create_api(String(req.params.databaseName), String(req.params.viewName), 'ws_' + String(req.params.viewName));
});

app.get('/create-user/:user/:password', (req, res) => {
    create_user(String(req.params.user), String(req.params.password));
    res.send('Done');
});

app.get('/get-api/:databaseName/:viewName', (req, res) => {
    var url = get_ws_url(String(req.params.databaseName), String(req.params.viewName));
    //res.send(url);
    res.send(url);
});

app.get('/download-excel/:databaseName/:wsName/:filename', (req, res) => {
    console.log(String(req.params.databaseName), String(req.params.wsName),  String(req.params.filename))
    const database = sample_data_link_ws(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.wsName)).then(function (results) {
        console.log(String(req.params.databaseName), String(req.params.wsName),  String(req.params.filename))
        //var responce = download(req, res, JSON.parse(results).elements, String(req.params.filename));
        console.log(results);
        res.send(JSON.parse(results).elements);
    }
    );
});

app.post('/create-datasource', (req, res) => {
    console.log(String(req.body.databaseName), String(req.body.datasourceType), String(req.body.datasourceName), String(req.body.driverClass), String(req.body.url), String(req.body.user), String(req.body.pass), String(req.body.classPath), String(req.body.database), String(req.body.version), parseInt(String(req.body.timeout)));
    connect_denodo('admin',password_admin,'admin');
    const database = create_datasource(String(req.body.databaseName), String(req.body.datasourceType), String(req.body.datasourceName), String(req.body.driverClass), String(req.body.url), String(req.body.user), String(req.body.pass), String(req.body.classPath), String(req.body.database), String(req.body.version), parseInt(String(req.body.timeout))).then(function (results) {
        console.log(results);
        res.send(results[0].status);
    });
});

app.get('/create-remoteTable/:remoteTableName/:database_source/:data_source/:database_view/:view', (req, res) => {
    console.log(String(req.params.remoteTableName), String(req.params.database_source), String(req.params.data_source), String(req.params.database_view), String(req.params.view))
    connect_denodo('admin', password_admin, 'admin')
    const database = create_remoteTable(String(req.params.remoteTableName), String(req.params.database_source), String(req.params.data_source), String(req.params.database_view), String(req.params.view))
    res.send('Done');
});

app.get('/access-privilege/:databaseName/:viewName/:wsName/:userName', (req, res) => {
    const database = access_privilege(String(req.params.databaseName),String(req.params.viewName), String(req.params.wsName), String(req.params.userName))
        //var responce = download(req, res, JSON.parse(results).elements, String(req.params.filename));
        res.send('Done');
});

app.get('/redploy-ws/:wsName', (req, res) => {
    const database = redploy_ws(String(req.params.wsName))
        //var responce = download(req, res, JSON.parse(results).elements, String(req.params.filename));
        res.send('Done');
});

app.get('/more-details/:databaseName/:wsName', (req, res) => {
    const api = openApi(String(req.params.databaseName), String(req.params.wsName))
    res.send(api);
});

app.get('/connection-details', (req, res) => {
    const connection = connection_details();
    res.send(connection);
});

app.get('/ws-viewName/:databaseName/:wsName', (req, res) => {
    const view_detail = ws_details(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.wsName)).then(function (results) {
        //console.log(results);
        //console.log(Object.getOwnPropertyNames(JSON.parse(results)));
        console.log(String(req.params.databaseName), String(req.params.wsName))
        console.log(Object.keys(JSON.parse(results).schema)[0]);
        res.send(Object.keys(JSON.parse(results).schema)[0]);
    }
    );
});

app.get('/list-users', (req, res) => {
    const users = list_users().then(function (results) {
        console.log(results);
        res.send(results);
    }
    );
});

app.get('/list-roles', (req, res) => {
    const users = list_roles().then(function (results) {
        console.log(results);
        res.send(results);
    }
    );
});

app.get('/map-users-ws', (req, res) => {
    const users = map_users_ws().then(function (results) {
        console.log(results);
        res.send(results);
    }
    );
});

// views(1, '//'+ip+':9999/admin', 'testdb', 50,1);
// console.log(sample_data(denododb, 'testdb', 'bv_dev_usecase_roles'));