import { sync_vdp_datacatalog, connect_denodo, create_api, databases, get_ws_url, ws_details, sample_data, views, view_columns, view_details, catalog_permissions, download, webcontainer_services, webservices, create_datasource, create_remoteTable, access_privilege } from './index.js';
import express from 'express';
import cors from 'cors';
import http from 'http';
import bp from 'body-parser';

const app = express();
var denododb;
const port = 3000;
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
var server = http.Server(app);

var ip = 'localhost';

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
});

app.get('/connect-denodo/:user/:pass', (req, res) => {
    var flag = connect_denodo(String(req.params.user + ''), String(req.params.pass + '')).then(function (results) {
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
        console.log("resultssss",results, String(req.params.user));
        res.send(results);
    });
});

app.get('/sync', (req, res) => {
    sync_vdp_datacatalog().then(function (results) {
        //console.log(results);
        res.send(results);
    });
});

app.get('/databases', (req, res) => {
    const database = databases(1, '//'+ip+':9999/admin').then(function (results) {
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


app.get('/sample-data/:databaseName/:viewName/:limit', (req, res) => {
    const data = sample_data(String(req.params.databaseName), String(req.params.viewName), parseInt(req.params.limit)).then(function (results) {
        //console.log(results);
        var samples = []
        if (typeof results === 'undefined') {
            return;
        }
        if (results.length != 0) {
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
    //res.send('http://'+ip+':9090/server/'+String(req.params.databaseName)+'/ws_'+String(req.params.viewName)+'/views/'+String(req.params.viewName)+'');
});

app.get('/get-api/:databaseName/:viewName', (req, res) => {
    var url = get_ws_url(String(req.params.databaseName), String(req.params.viewName));
    //res.send(url);
    res.send(url);
});

app.get('/download-excel', (req, res) => {
    const database = sample_data('testdb', 'bv_dmp_test_download', 9002).then(function (results) {
        var responce = download(req, res, results);
    }
    );
});

app.post('/create-datasource', (req, res) => {
    console.log(String(req.body.databaseName), String(req.body.datasourceType), String(req.body.datasourceName), String(req.body.driverClass), String(req.body.url), String(req.body.user), String(req.body.pass), String(req.body.classPath), String(req.body.database), String(req.body.version), parseInt(String(req.body.timeout)));
    const database = create_datasource(String(req.body.databaseName), String(req.body.datasourceType), String(req.body.datasourceName), String(req.body.driverClass), String(req.body.url), String(req.body.user), String(req.body.pass), String(req.body.classPath), String(req.body.database), String(req.body.version), parseInt(String(req.body.timeout))).then(function (results) {
        res.send(results);
    });
});

app.get('/create-remoteTable/:remoteTableName/:database_source/:data_source/:database_view/:view', (req, res) => {
    const database = create_remoteTable(String(req.params.remoteTableName), String(req.params.database_source), String(req.params.data_source), String(req.params.database_view), String(req.params.view)).then(function (results) {
        res.send(results);
    });
});

app.get('/access-privilege/:databaseName/:wsName/:userName', (req, res) => {
    const database = access_privilege(String(req.params.databaseName), String(req.params.wsName), String(req.params.userName)).then(function (results) {
        res.send(results);
    });
});

// views(1, '//'+ip+':9999/admin', 'testdb', 50,1);
// console.log(sample_data(denododb, 'testdb', 'bv_dev_usecase_roles'));