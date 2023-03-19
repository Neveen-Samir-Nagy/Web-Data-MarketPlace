import JDBC from 'jdbc';
import jinst from 'jdbc/lib/jinst.js';
import asyncjs from 'async';
import request from 'request';
import excel from 'exceljs';
import { password_admin, ip, port_denodo, protocol_denodo } from '../index.js';

var denododb;

export var connect_denodo = function (user = 'admin', pass = password_admin, database = 'admin') {
    return new Promise((resolve, reject) => {
        if (!jinst.isJvmCreated()) {
            jinst.addOption("-Xrs");
            jinst.setupClasspath(['C:/Denodo/DenodoPlatform8.0/tools/client-drivers/jdbc/denodo-vdp-jdbcdriver.jar']);
        }
        var config = {
            url: 'jdbc:denodo://' + ip + ':9999/' + database,
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
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                console.log(err);
                            } else {
                                statement.setFetchSize(100, function (err) {
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
                                        statement.executeQuery("call WEBCONTAINER_ELEMENTS(null, null, null, null, null, null, true);",
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

export var webservices = (user) => {
    return new Promise((resolve, reject) => {
        const all_ws = webcontainer_services().then(function (results1) {
            const ws_with_privileges = catalog_permissions(user).then(function (results2) {
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

export var access_privilege_on_database = (databaseName, userName) => {
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
                                        statement.executeQuery("ALTER USER " + userName + " GRANT CONNECT ON " + databaseName + ";",)

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

export var access_privilege_on_view = (databaseName, viewName, userName) => {
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
                                        statement.executeQuery("ALTER USER " + userName + " GRANT METADATA,EXECUTE ON " + databaseName + "." + viewName + ";",)

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

export var access_privilege_on_ws = (wsName, userName) => {
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
                                        statement.executeQuery("ALTER USER " + userName + " GRANT METADATA ON webservice " + wsName + ";",

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

export var access_privilege_on_ws_accepted_user = (databaseName, wsName, userName) => {
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

                                        statement.executeQuery("desc vql webservice " + databaseName + "." + wsName + " ('includeDependencies'='no','replaceExistingElements'='yes','dropElements'='no');",
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
                                                            var first_part = results[0].result.substring(0, first_index + "(BASIC VDP".length);
                                                            var second_index = results[0].result.indexOf("RESOURCES (");
                                                            var second_part = results[0].result.substring(second_index, results[0].result.length);
                                                            var middle_part = results[0].result.substring(first_index + "(BASIC VDP".length, second_index);
                                                            var users = " VDPACCEPTEDUSERS " + "'" + userName + "," + middle_part.substring(middle_part.indexOf("'") + 1, middle_part.length);
                                                            results[0].result = first_part + users + second_part;
                                                            console.log("first_part", first_part)
                                                            console.log("middle_part", middle_part)
                                                            console.log("users", users)
                                                            console.log("second_part", second_part)
                                                            console.log(results[0].result + "; \n" + "REDEPLOY WEBSERVICE " + wsName + ";",);
                                                            statement.executeQuery(results[0].result + ";",);
                                                            statement.executeQuery("REDEPLOY WEBSERVICE " + wsName + ";",);
                                                            console.log('execution done')
                                                            //return resolve(results);
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
                        })
                    }
                ]);
            }
        })
    })
};

export var redploy_ws = (wsName) => {
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
                                        statement.executeQuery("REDEPLOY WEBSERVICE " + wsName + ";",
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

export var access_privilege = (databaseName, viewName, wsName, userName) => {
    console.log(databaseName, viewName, wsName, userName);
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
                                        console.log('before', password_admin, databaseName)
                                        connect_denodo('admin', password_admin, databaseName);
                                        console.log('after', password_admin, databaseName)
                                        access_privilege_on_database(databaseName, userName);
                                        access_privilege_on_view(databaseName, viewName, userName);
                                        access_privilege_on_ws(wsName, userName);
                                        console.log('before accepted user')

                                        access_privilege_on_ws_accepted_user(databaseName, wsName, userName);
                                        console.log('after accepted user')
                                        //redploy_ws(wsName)

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

export var create_datasource = (databaseName, datasourceType = 'JDBC', datasourceName, driverClassName, databaseURL, user, password, classPath, database, version, timeout) => {
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
                                        statement.executeQuery("CREATE OR REPLACE DATASOURCE JDBC " + datasourceName + " " +
                                            "DRIVERCLASSNAME = '" + driverClassName + "'" +
                                            "DATABASEURI = '" + databaseURL + "'" +
                                            "USERNAME = '" + user + "' USERPASSWORD = '" + password + "'" +
                                            "CLASSPATH = '" + classPath + "'" +
                                            "DATABASENAME = '" + database + "'" +
                                            "DATABASEVERSION = '" + version + "';", () => { }
                                        );
                                        statement.executeQuery("CALL PING_DATA_SOURCE ( 'admin'," +
                                            "'" + datasourceType + "'" +
                                            ",'" + datasourceName + "'" +
                                            ");",
                                            function (err, resultset) {
                                                console.log("CALL PING_DATA_SOURCE ( 'admin'," +
                                                    "'" + datasourceType + "'" +
                                                    ",'" + datasourceName + "'" +
                                                    ");");
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
                                        statement.executeQuery("CREATE REMOTE TABLE " + tableName + " INTO " + databaseName_source + "." + datasourceName + " AS SELECT * FROM " + databaseName_view + "." + viewName + ";",);

                                        statement.executeQuery("DROP DATASOURCE JDBC IF EXISTS " + datasourceName + ";",
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

export var create_user = (user, password) => {
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
                                        connect_denodo('admin', password_admin, 'admin')
                                        statement.executeQuery("CREATE USER " + user + " '" + password + "' SHA512  grant connect on admin;",);
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

export var list_users = () => {
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
                                        statement.executeQuery("LIST USERS;",
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
                                                            return resolve(results);
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    }
                                                    );
                                                }
                                            }
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

export var list_roles = () => {
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
                                        statement.executeQuery("LIST ROLES;",
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
                                                            return resolve(results);
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    }
                                                    );
                                                }
                                            }
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

export var map_users_ws = () => {
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
                                        statement.executeQuery("SELECT elementname, list(username) as list_users,list(dbname) as list_databases FROM catalog_permissions(null,null) where elementtype='Web service' group by elementname;",
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
                                                            return resolve(results);
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    }
                                                    );
                                                }
                                            }
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

export var revoke_user = (username, databaseName, wsName) => {
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
                                        statement.executeQuery("alter user " + username + " revoke metadata on webservice " + databaseName + "." + wsName + ";",

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

export var drop_user = (username) => {
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
                                        statement.executeQuery("DROP USER " + username + ";",

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
