import JDBC from 'jdbc';
import jinst from 'jdbc/lib/jinst.js';
import asyncjs from 'async';
import request from 'request';
import pg from 'pg';

const { Pool, Client } = pg;
var pg_client;

export var connect_to_pg = function () {
    return new Promise((resolve, reject) => {
    const connectionString = 'postgresql://postgres:postgres@localhost:5432/Requests'

    pg_client = new Client({
        connectionString,
    })
    pg_client.connect()
})
};

export var insert_request = function (username, wsName, creation_date, status, database) {
    pg_client.query(`INSERT INTO request(id, username, ws, creation_date, STATUS, database_name) VALUES (DEFAULT, '${username}', '${wsName}', '${creation_date}', '${status}', '${database}');`, (err, res) => {
    })
};

export var select_request_all = function () {
    return new Promise((resolve, reject) => {
    pg_client.query(`SELECT * FROM request order by id;`, (err, res) => {
        console.log(res.rows);
        return resolve(res.rows);
    })
    })
};

export var select_request_of_user = function (username) {
    return new Promise((resolve, reject) => {
    pg_client.query(`SELECT * FROM request where username = '${username}' order by id;`, (err, res) => {
        console.log(res.rows);
        return resolve(res.rows);
    })
    })
};

export var select_requests_withStatus = function (username, status) {
    return new Promise((resolve, reject) => {
    pg_client.query(`SELECT * FROM request where username = '${username}' and status = '${status}' order by id;`, (err, res) => {
        console.log(res.rows);
        return resolve(res.rows);
    })
    })
};

export var update_status = function (username, wsName, status,viewname) { 
    return new Promise((resolve, reject) => { 
        pg_client.query(`UPDATE request SET status = '${status}' ,viewname= '${viewname}' where username = '${username}' and ws = '${wsName}';`, (err, res) => { 
            if(status == 'COMPLETED'){ 
            access_privilege() } 
        }) 
    })
};

export var delete_request = function (username, wsName, status) {
    return new Promise((resolve, reject) => {
    pg_client.query(`DELETE FROM request WHERE status = '${status}' and username = '${username}' and ws = '${wsName}';`, (err, res) => {
    })
    })
};

