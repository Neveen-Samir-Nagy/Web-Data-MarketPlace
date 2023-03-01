import JDBC from 'jdbc';
import jinst from 'jdbc/lib/jinst.js';
import asyncjs from 'async';
import request from 'request';
import excel from 'exceljs';

var categories = [];
var denododb;
var ip = 'localhost';
var password_admin = 'admin';


export var sync_vdp_datacatalog = function () {
    return new Promise((resolve, reject) => {
        var headers = {
            'Authorization': 'Basic YWRtaW46YWRtaW4=',
            'Content-Type': 'application/json'
        };
        var dataString = '{ "allServers": "true", "priority": "server_with_local_changes", "proceedWithConflicts": "SERVER" }';
        request({
            url: 'http://'+ip+':9090/denodo-data-catalog/public/api/element-management/all/synchronize/all-servers',
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

export var connect_denodo = function (user = 'admin', pass = password_admin, database = 'admin') {
    return new Promise((resolve, reject) => {
        if (!jinst.isJvmCreated()) {
            jinst.addOption("-Xrs");
            jinst.setupClasspath(['C:/Denodo/DenodoPlatform8.0/tools/client-drivers/jdbc/denodo-vdp-jdbcdriver.jar']);
        }
        var config = {
            url: 'jdbc:denodo://'+ip+':9999/'+database,
            drivername: 'com.denodo.vdp.jdbc.Driver',
            minpoolsize: 1,
            maxpoolsize: 100,
            user: user,
            password: pass,
            charset: 'utf8'
        };
        denododb = new JDBC(config);
        denododb.initialize(function (err) {
            if (err) {
                console.log(err);
                return resolve(false);
            } else {
                console.log("Connected");
                return resolve(true);
            }
        });
    });
};

// var denododb = connect_denodo('testdb');

export var databases = function (serverId = 1, uri = '//'+ip+':9999/admin') {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: 'http://'+ip+':9090/denodo-data-catalog/public/api/category-management/categories?serverId=' + serverId + '&uri=' + uri + '',
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

export var views = function (serverId = 1, uri = '//'+ip+':9999/admin', databaseName, limit = 50, offest = 1) {
    //var id = (categories.find(x => x.name === databaseName)).id;
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: 'http://'+ip+':9090/denodo-data-catalog/public/api/database-management/vdp/views?databaseName=' + databaseName + '&limit=' + limit + '&offset=' + offest + '&serverId=' + serverId + '&uri=' + uri + '',
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

export var view_details = function (serverId = 1, uri = '//'+ip+':9999/admin', databaseName = 'testdb', viewName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: 'http://'+ip+':9090/denodo-data-catalog/public/api/view-details?databaseName=' + databaseName + '&serverId=' + serverId + '&uri=' + uri + '&viewName=' + viewName + '',
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

export var view_columns = function (serverId = 1, uri = '//'+ip+':9999/admin', databaseName = 'testdb', viewName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: 'http://'+ip+':9090/denodo-data-catalog/public/api/views/columns?databaseName=' + databaseName + '&serverId=' + serverId + '&uri=' + uri + '&viewName=' + viewName + '',
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

export var sample_data_link_ws = function (serverId = 1, uri = '//'+ip+':9999/admin', databaseName = 'testdb', wsName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: 'http://localhost:9090/server/'+databaseName+'/'+wsName+'?$displayRESTfulReferences=true&$format=JSON',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=',
            'Content-Type': 'application/json' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(JSON.parse(body)['views-metadata'][0]['name']);
                return resolve(sample_data_from_ws(databaseName, wsName, JSON.parse(body)['views-metadata'][0]['name']));
            } else {
                console.log(error);
            }
        })
    })
};

export var sample_data_from_ws = function (databaseName, wsName, viewName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: 'http://localhost:9090/server/'+databaseName+'/'+wsName+'/views/' + viewName+'?$displayRESTfulReferences=true&$format=JSON',
            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=',
            'Content-Type': 'application/json' }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return resolve(JSON.parse(body).elements.slice(0,10));
            } else {
                console.log(error);
            }
        })
    })
};

// view_columns(serverId = 1, uri = '//'+ip+':9999/admin', databaseName = 'test', viewName = 'bv_datacatalog_databases');

export var sample_data = function (databaseName = 'admin', viewName, limit = 10) {
    return new Promise((resolve, reject) => {
        denododb.reserve(function (err, connObj) {
            if (connObj) {
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                    function () {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                console.log(err);
                            } else {
                                statement.setFetchSize(100, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //Execute a query
                                        statement.executeQuery("select * from " + databaseName + "." + viewName + " limit " + limit + ";",
                                            function (err, resultset) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    resultset.toObjArray(function (err, results) {
                                                        //Printing number of records
                                                        if (typeof results === 'undefined') {
                                                            return resolve([]);
                                                        }
                                                        if (results.length > 0) {
                                                            // console.log("Record count: " + results.length);
                                                            // console.log(results);
                                                            return resolve(results);
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    }
                                                    );
                                                }
                                            });
                                    }
                                });
                            }
                        });
                    }
                ]);
            }
        })
    })
};

export var catalog_permissions = (username = 'admin') => {
    return new Promise((resolve, reject) => {
        denododb.reserve(function (err, connObj) {
            if (connObj) {
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                     function () {
                        // Select statement example.
                         conn.createStatement( function (err, statement) {
                            if (err) {
                                console.log(err);
                            } else {
                                 statement.setFetchSize(100,  function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //Execute a query
                                         statement.executeQuery("CALL CATALOG_PERMISSIONS('" + String(username) + "');",
                                             function (err, resultset) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                     resultset.toObjArray(function (err, results) {
                                                        //Printing number of records
                                                        if (typeof results === 'undefined') {
                                                            console.log('undefined');
                                                            return resolve([]);
                                                        }
                                                        if (results.length > 0) {
                                                            // console.log("Record count: " + results.length);
                                                            return resolve(results.filter((e) => e.elementtype == null || e.elementtype == 'Web service'));
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    }
                                                    );
                                                }
                                            });
                                    }
                                });
                            }
                        });
                    }
                ]);
            }
        })
    })
};

export var webcontainer_services = () => {
    return new Promise((resolve, reject) => {
        denododb.reserve(function (err, connObj) {
            if (connObj) {
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                    function () {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                console.log(err);
                            } else {
                                statement.setFetchSize(100, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //Execute a query
                                         statement.executeQuery("call WEBCONTAINER_ELEMENTS();",
                                            function (err, resultset) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    resultset.toObjArray(function (err, results) {
                                                        //Printing number of records
                                                        if (typeof results === 'undefined') {
                                                            console.log('undefined');
                                                            return resolve([]);
                                                        }
                                                        if (results.length > 0) {
                                                            // console.log("Record count: " + results.length);
                                                            return resolve(results.filter((e) => e.deployed === true));
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    }
                                                    );
                                                }
                                            });
                                    }
                                });
                            }
                        });
                    }
                ]);
            }
        })
    })
};

export var ws_details = function (serverId = 1, uri = '//'+ip+':9999/admin', databaseName = 'testdb', wsName) {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            uri: 'http://'+ip+':9090/denodo-data-catalog/public/api/webservice-details?databaseName=' + databaseName + '&serverId=' + serverId + '&uri=' + uri + '&webserviceName=' + wsName + '',
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

export var webservices = (user) => {
    return new Promise((resolve, reject) => {
        const all_ws = webcontainer_services().then(function (results1) {
            const ws_with_privileges = catalog_permissions(user).then(function (results2) {
                console.log("results22222",results2);
                var count = 0;
                 results1.forEach(function (element) {
                    try {
                        // var view_detail = await ws_details(1, '//'+ip+':9999/admin', String(element['database_name']), String(element['service_name'])).then(function (results) {
                        //     count++;
                        //     results = JSON.parse([results]);
                        //     element.id = results.id;
                        //     element.viewName = results.localWsOperations;
                        //     element.tags = results.tags;
                        //     element.categories = results.categories;
                        //     element.schema = results.schema;
                        //     element.url = results.connectionUris['web-service-connection-url'];
                            if (results2.find(ws => ws['username'] === 'admin') !== undefined) {
                                element.subscripe = true;
                            } else if (results2.find(ws => ws['dbname'] === element['database_name'] && ws['elementname'] === element['service_name']) === undefined) {
                                element.subscripe = false;
                            } else {
                                element.subscripe = true;
                            }
                            //Don't touch this comment or there will be no return (bossey htz3al)
                            // if(count === results1.length){
                                return resolve(results1);
                            // }

                        // });
                    } catch (err) {
                        console.log('Error', err);
                    }
                });
            });
        });
    });

};

// sample_data('testdb', 'bv_dev_usecase_roles', 10);

export var create_api = function (databaseName, viewName, wsName) {
    denododb.reserve(function (err, connObj) {
        if (connObj) {
            var conn = connObj.conn;
            // Query the database.
            asyncjs.series([
                function () {
                    conn.createStatement(function (err, statement) {
                        if (err) {
                            console.log(err);
                        } else {
                            statement.setFetchSize(100, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //Execute a query
                                    statement.executeQuery("CREATE OR REPLACE REST WEBSERVICE " + wsName + " \n CONNECTION (" +
                                        "CHUNKSIZE = 1000" +
                                        " CHUNKTIMEOUT = 90000" +
                                        "QUERYTIMEOUT = 900000" +
                                        " POOLENABLED = true" +
                                        " POOLINITSIZE = 0" +
                                        "  POOLMAXACTIVE = 30" +
                                        " )" +
                                        " DEFAULTREPRESENTATION = JSON" +
                                        " SUPPORTEDREPRESENTATIONS (HTML, XML, JSON)" +
                                        " RESOURCES (" +
                                        " VIEW " + viewName + " FIELDS (" +
                                        "     id : 'text', " +
                                        "     nameen : 'text'" +
                                        "   )" +
                                        " )" +
                                        " OPTIONS ( NULLVALUESASEMPTYXMLELEMENTS = false" +
                                        " PROCESS_FUNCTIONS_IN_SELECT_PARAMETER = true ) " +
                                        "OPENAPI2 ( API_VERSION = '1.0.0' ) " +
                                        "FOLDER = '/3. Web Services';",
                                    );

                                    statement.executeQuery("DEPLOY WEBSERVICE ws_" + viewName + " \n " +
                                        "LOGIN = 'admin'" +
                                        "PASSWORD = 'admin'" +
                                        ";",
                                    );
                                }
                            });
                        }
                    });
                },
            ]);
        }
    });
};

export var get_ws_url = function (databaseName, viewName) {
    var url = 'http://'+ip+':9090/denodo-restfulws/' + databaseName + '/views/' + viewName;
    return url;
};

export var access_privilege = (databaseName, viewName, wsName, userName) => {
    return new Promise( (resolve, reject) => {
         denododb.reserve(function (err, connObj) {
            if (connObj) {
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                     function () {
                        // Select statement example.
                         conn.createStatement( function (err, statement) {
                            if (err) {
                                console.log(err);
                            } else {
                                statement.setFetchSize(100,  function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //Execute a query
                                        connect_denodo('admin', password_admin, databaseName);
                                        statement.executeQuery("ALTER USER "+userName+" GRANT CONNECT ON "+databaseName+";",
                                        

                                        statement.executeQuery("ALTER USER "+userName+" GRANT METADATA,EXECUTE ON "+databaseName+"."+viewName+";",
                                        

                                        statement.executeQuery("desc vql webservice "+databaseName+"."+wsName+" ('includeDependencies'='no','replaceExistingElements'='yes','dropElements'='no');",
                                        function (err, resultset) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                resultset.toObjArray(function (err, results) {
                                                    //Printing number of records
                                                    if (typeof results === 'undefined') {
                                                        return resolve([]);
                                                    }
                                                    if (results.length > 0) {
                                                        // console.log("Record count: " + results.length);
                                                        var first_index = results[0].result.indexOf("(BASIC VDP");
                                                        var first_part = results[0].result.substring(0, first_index+"(BASIC VDP".length);
                                                        var second_index = results[0].result.indexOf("RESOURCES (");
                                                        var second_part = results[0].result.substring(second_index, results[0].result.length);
                                                        var middle_part = results[0].result.substring(first_index+"(BASIC VDP".length, second_index);
                                                        var users = " VDPACCEPTEDUSERS "+"'"+userName+","+middle_part.substring(middle_part.indexOf("'")+1, middle_part.length)
                                                        results[0].result = first_part + users + second_part;
                                                        console.log(first_part + users + second_part);
                                                        return resolve(results);
                                                    } else {
                                                        console.log(err);
                                                    }
                                                }
                                                );
                                            }
                                        }
                                        )
                                        )
                                        
                                        );
                                        
                                    }
                                });
                            }
                        });
                    }
                ]);
            }
        })
    })
};

export var redploy_ws = (wsName, query) => {
    return new Promise( (resolve, reject) => {
         denododb.reserve(function (err, connObj) {
            if (connObj) {
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                     function () {
                        // Select statement example.
                         conn.createStatement( function (err, statement) {
                            if (err) {
                                console.log(err);
                            } else {
                                statement.setFetchSize(100,  function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //Execute a query
                                        statement.executeQuery(query,);
                                        statement.executeQuery("REDEPLOY WEBSERVICE "+wsName+";",);
                                    }
                                });
                            }
                        });
                    }
                ]);
            }
        })
    })
};

// create_api('bv_dev_usecase_roles');

export var download = (req, res, objs) => {
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet("Tutorials");
    var headers = Object.keys(objs[0]);
    var columns = [];
    headers.forEach((head) => {
        columns.push({ header: head, key: head});
    });
    worksheet.columns = columns;
    console.log(objs);
    worksheet.addRows(objs); // Add data in worksheet
    console.log(worksheet.getRow(2).values);

    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    try {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "tutorials.xlsx"
          );
        const data = workbook.xlsx.write(res)
            .then(() => {
                res.send({
                    status: "success",
                    message: "file successfully downloaded",
                    path: 'tutorials.xlsx',
                });
            });
    } catch (err) {
        res.send({
            status: "error",
            message: "Something went wrong",
        });
    }
};

export var create_datasource = (databaseName, datasourceType = 'JDBC', datasourceName, driverClassName, databaseURL, user, password, classPath, database, version, timeout) => {
    return new Promise( (resolve, reject) => {
         denododb.reserve(function (err, connObj) {
            if (connObj) {
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                     function () {
                        // Select statement example.
                         conn.createStatement( function (err, statement) {
                            if (err) {
                                console.log(err);
                            } else {
                                statement.setFetchSize(100,  function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //Execute a query
                                         statement.executeQuery("CREATE OR REPLACE DATASOURCE JDBC "+ datasourceName +" FOLDER = '/01 - Connectivity/01 - Data Source'"+
                                        "DRIVERCLASSNAME = '"+ driverClassName +"'"+
                                        "DATABASEURI = '"+ databaseURL +"'"+ 
                                        "USERNAME = '"+ user +"' USERPASSWORD = '" + password+ "'"+
                                        "CLASSPATH = '"+classPath+"'"+
                                        "DATABASENAME = '"+database+"'"+
                                        "DATABASEVERSION = '"+version+"';",()=>{}
                                        );
                                         statement.executeQuery("CALL PING_DATA_SOURCE ( '" +databaseName+ "',"+
                                            "'" + datasourceType + "'"+
                                           ",'" +datasourceName+ "'"+
                                           "," + timeout + ""+
                                       ");",
                                        function (err, resultset) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                             resultset.toObjArray(function (err, results) {
                                                //Printing number of records
                                                if (typeof results === 'undefined') {
                                                    console.log('undefined...');
                                                    return resolve([]);
                                                }
                                                if (results.length > 0) {
                                                    console.log(results);
                                                    return resolve(results);
                                                } else {
                                                    console.log(err);
                                                }
                                            }
                                            );
                                        }
                                    });
                                    }
                                });
                            }
                        });
                    }
                ]);
            }
        })
    })
};

export var create_remoteTable = (tableName, databaseName_source, datasourceName, databaseName_view, viewName) => {
    return new Promise( (resolve, reject) => {
         denododb.reserve(function (err, connObj) {
            if (connObj) {
                var conn = connObj.conn;
                // Query the database.
                asyncjs.series([
                     function () {
                        // Select statement example.
                         conn.createStatement( function (err, statement) {
                            if (err) {
                                console.log(err);
                            } else {
                                statement.setFetchSize(100,  function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //Execute a query
                                        connect_denodo('admin', password_admin, 'admin')
                                        statement.executeQuery("CREATE REMOTE TABLE "+tableName+" INTO "+databaseName_source+"." +datasourceName+" AS SELECT * FROM "+databaseName_view+"."+viewName+";",);

                                        statement.executeQuery("DROP DATASOURCE JDBC IF EXISTS "+datasourceName+";",
                                        );
                                        
                                    }
                                });
                            }
                        });
                    }
                ]);
            }
        })
    })
};