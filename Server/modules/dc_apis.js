import request from 'request';
import { password_admin, ip, port_denodo, protocol_denodo } from '../index.js';

export var sync_vdp_datacatalog = function () {
    return new Promise((resolve, reject) => {
        var headers = {
            'Authorization': 'Basic YWRtaW46YWRtaW4=',
            'Content-Type': 'application/json'
        };
        var dataString = '{ "allServers": "true", "priority": "server_with_local_changes", "proceedWithConflicts": "SERVER" }';
        request({
            url: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/element-management/all/synchronize/all-servers',
            method: 'POST',
            headers: headers,
            body: dataString
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                // console.log(body);
                return resolve(true);
            } else {
                console.log(error);
            }
        })
    })
}

export var categories = function (serverId = 1, uri = '//' + ip + ':9999/admin') {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/category-management/categories?serverId=' + serverId + '&uri=' + uri + '',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=', 'Content-Type': 'application/json' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                categories = JSON.parse(body);
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var ws_of_category = function (serverId = 1, uri = '//' + ip + ':9999/admin', category_id, limit = 50, offest = 0) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/browse/categories/' + category_id + '/elements/type/WEBSERVICES?limit=' + limit + '&offset=' + offest + '&serverId=' + serverId + '&uri=' + uri + '',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=', 'Content-Type': 'application/json' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                categories = JSON.parse(body);
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var tags = function (serverId = 1, uri = '//' + ip + ':9999/admin') {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/tags?serverId=' + serverId + '&uri=' + uri + '',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=', 'Content-Type': 'application/json' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var ws_of_tag = function (serverId = 1, uri = '//' + ip + ':9999/admin', tag_id, limit = 50, offest = 0) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/browse/tags/' + tag_id + '/elements/type/WEBSERVICES?limit=' + limit + '&offset=' + offest + '&serverId=' + serverId + '&uri=' + uri + '',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=', 'Content-Type': 'application/json' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body);
                categories = JSON.parse(body);
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var views = function (serverId = 1, uri = '//' + ip + ':9999/admin', databaseName, limit = 50, offest = 0) {
    //var id = (categories.find(x => x.name === databaseName)).id;
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/database-management/vdp/views?databaseName=' + databaseName + '&limit=' + limit + '&offset=' + offest + '&serverId=' + serverId + '&uri=' + uri + '',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=', 'Content-Type': 'application/json' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // body = JSON.parse(body);
                console.log(body['data']);
                return resolve(body.views);
            } else {
                console.log(error);
            }
        })
    })
};

export var view_details = function (serverId = 1, uri = '//' + ip + ':9999/admin', databaseName = 'testdb', viewName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/view-details?databaseName=' + databaseName + '&serverId=' + serverId + '&uri=' + uri + '&viewName=' + viewName + '',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var view_columns = function (serverId = 1, uri = '//' + ip + ':9999/admin', databaseName = 'testdb', viewName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/views/columns?databaseName=' + databaseName + '&serverId=' + serverId + '&uri=' + uri + '&viewName=' + viewName + '',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var sample_data_link_ws = function (serverId = 1, uri = '//' + ip + ':9999/admin', databaseName = 'testdb', wsName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/server/' + databaseName + '/' + wsName + '?$displayRESTfulReferences=true&$format=JSON',
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return resolve(sample_data_from_ws(databaseName, wsName, JSON.parse(body)['views-metadata'][0]['name']));
            } else {
                console.log(error);
            }
        })
    })
};

export var sample_data_link_ws_pm = function (serverId = 1, uri = '//' + ip + ':9999/admin', databaseName = 'testdb', wsName) {
    return new Promise((resolve, reject) => {
        var req = pm('' + protocol_denodo + '://' + ip + ':' + port_denodo + '/server/' + databaseName + '/' + wsName + '?$displayRESTfulReferences=true&$format=JSON', function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response); // Print the response status code if a response was received
            //console.log('body:', body); // Print the HTML for the Google homepage.
        });

    })
};

export var sample_data_from_ws = function (databaseName, wsName, viewName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/server/' + databaseName + '/' + wsName + '/views/' + viewName + '?$displayRESTfulReferences=true&$format=JSON',
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var ws_details = function (serverId = 1, uri = '//' + ip + ':9999/admin', databaseName = 'testdb', wsName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/webservice-details?databaseName=' + databaseName + '&serverId=' + serverId + '&uri=' + uri + '&webserviceName=' + wsName + '',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var usage_statistics = function (serverId = 1, uri = '//' + ip + ':9999/admin', databaseName = 'testdb', wsName, wsType) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-data-catalog/public/api/statistic-management/statistics?databaseName='+databaseName+'&elementName='+wsName+'&elementType='+wsType+'&serverId='+serverId+'&uri='+uri+'',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return resolve(body);
            } else {
                console.log(error);
            }
        })
    })
};

export var get_ws_url = function (databaseName, viewName) {
    var url = '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/denodo-restfulws/' + databaseName + '/views/' + viewName;
    return url;
};

export var openApi = (databaseName, wsName) => {
    var link = '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/swagger-ui/index.html?url=' + protocol_denodo + '://' + ip + ':' + port_denodo + '/server/' + databaseName + '/' + wsName + '/OpenAPIv3/openapi.json'
    return link;
};

export var connection_details = () => {
    var details = [{ "server_ip": ip, "port": port_denodo }]
    return details;
};

export var run_job = function (serverId = 1, uri = '//' + ip + ':8000', projectId = 3, jobId = 110) {
    return new Promise((resolve, reject) => {
        request({
            method: 'PUT',
            uri: '' + protocol_denodo + '://' + ip + ':' + port_denodo + '/webadmin/denodo-scheduler-admin/public/api/projects/'+projectId+'/jobs/'+jobId+'/status?uri='+uri+'',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=', 'accept': 'application/json', 'Content-Type': 'application/json' },
            json: {action:'start'}
        }, function (error, response, body) {
            if (!error && (response.statusCode == 200 || response.statusCode == 204)) {
                return resolve('Done');
            } else {
                console.log(error);
            }
        })
    })
};