import JDBC from 'jdbc';
import jinst from 'jdbc/lib/jinst.js';
import asyncjs from 'async';
import request from 'request';
import excel from 'exceljs';
import pg from 'pg';
// import Blob from 'node:buffer';
// import pkg from 'file-saver';
// const { saveAs } = pkg;

export var protocol_denodo = 'http';
export var ip = 'localhost';
export var port_denodo = '9090';
export var password_admin = 'admin';