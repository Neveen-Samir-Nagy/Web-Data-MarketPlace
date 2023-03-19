import express from 'express';
import cors from 'cors';
import bp from 'body-parser';
import http from 'http';
import { categories, connection_details, get_ws_url, openApi, sample_data_link_ws, sync_vdp_datacatalog, tags, views, view_columns, view_details, ws_details, ws_of_category, ws_of_tag } from '../modules/dc_apis.js';

export const app_dc = express();
app_dc.use(cors());
app_dc.use(bp.json());
app_dc.use(bp.urlencoded({ extended: true }));
var server = http.Server(app_dc);
var password_admin = 'admin';
var protocol_denodo = 'http';
var ip = 'localhost';
var port_denodo = '9090';

app_dc.get('/sync', (req, res) => {
    sync_vdp_datacatalog().then(function (results) {
        //console.log(results);
        res.send(results);
    });
});

app_dc.get('/categories', (req, res) => {
    const category = categories(1, '//'+ip+':9999/admin').then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});

app_dc.get('/ws-of-category/:category_id/:limit/:offest', (req, res) => {
    const ws_category = ws_of_category(1, '//'+ip+':9999/admin', parseInt(req.params.category_id), parseInt(req.params.limit), parseInt(req.params.offest)).then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});

app_dc.get('/tags', (req, res) => {
    const tag = tags(1, '//'+ip+':9999/admin').then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});

app_dc.get('/ws-of-tag/:tag_id/:limit/:offest', (req, res) => {
    const ws_tag = ws_of_tag(1, '//'+ip+':9999/admin', parseInt(req.params.tag_id), parseInt(req.params.limit), parseInt(req.params.offest)).then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});

app_dc.get('/views/:databaseName/:limit/:offest', (req, res) => {
    const view = views(1, '//'+ip+':9999/admin', String(req.params.databaseName), parseInt(req.params.limit), parseInt(req.params.offest)).then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});

app_dc.get('/view-details/:databaseName/:viewName', (req, res) => {
    const view_detail = view_details(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.viewName)).then(function (results) {
        //console.log(results);
        //console.log(Object.getOwnPropertyNames(JSON.parse(results)));
        res.send([results]);
    }
    );
});

app_dc.get('/ws-details/:databaseName/:wsName', (req, res) => {
    const view_detail = ws_details(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.wsName)).then(function (results) {
        //console.log(results);
        //console.log(Object.getOwnPropertyNames(JSON.parse(results)));
        res.send([results]);
    }
    );
});

app_dc.get('/view-columns/:databaseName/:viewName', (req, res) => {
    const view_column = view_columns(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.viewName)).then(function (results) {
        //console.log(results);
        res.send(results);
    }
    );
});


app_dc.get('/sample-data/:databaseName/:wsName/', (req, res) => {
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

app_dc.get('/get-api/:databaseName/:viewName', (req, res) => {
    var url = get_ws_url(String(req.params.databaseName), String(req.params.viewName));
    //res.send(url);
    res.send(url);
});

app_dc.get('/download-excel/:databaseName/:wsName/:filename', (req, res) => {
    const database = sample_data_link_ws(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.wsName)).then(function (results) {
        console.log(String(req.params.databaseName), String(req.params.wsName),  String(req.params.filename))
        //var responce = download(req, res, JSON.parse(results).elements, String(req.params.filename));
        console.log(results);
        res.send(JSON.parse(results).elements);
    }
    );
});


app_dc.get('/more-details/:databaseName/:wsName', (req, res) => {
    const api = openApi(String(req.params.databaseName), String(req.params.wsName))
    res.send(api);
});

app_dc.get('/connection-details', (req, res) => {
    const connection = connection_details();
    res.send(connection);
});

app_dc.get('/ws-viewName/:databaseName/:wsName', (req, res) => {
    const view_detail = ws_details(1, '//'+ip+':9999/admin', String(req.params.databaseName), String(req.params.wsName)).then(function (results) {
        //console.log(results);
        res.send(Object.keys(JSON.parse(results).schema)[0]);
    }
    );
});

