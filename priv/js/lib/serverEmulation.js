exports.init = function(page, cb) {
    page.on('req_run', function(_, id) {
        page.emit('res_run', null, {
            id : id,
            modules : [
            {
                name : 'test_modulea',
                tests : [
                    {
                        name : 'bla_blabla',
                        series : {
                            memutil : {
                                previous : 100,
                                mean : 90,
                                current : 110,
                                max : 200,
                                min : 50
                            },
                            time : {
                                previous : 311,
                                current : 300
                            }
                        }
                    }, {
                        name : 'what_ever',
                        series : {
                            memutil : {
                                previous : 150,
                                mean : 90,
                                current : 130,
                                max : 200,
                                min : 50
                            },
                            time : {
                                previous : 250,
                                current : 330
                            }
                        }
                    }
                ]
            }, {
                name : 'test_moduleb',
                tests : [
                    {
                        name : 'foo_bar',
                        series : {
                            memutil : {
                                previous : 100,
                                mean : 120,
                                current : 130,
                                max : 250,
                                min : 100
                            },
                            time : {
                                previous : 211,
                                current : 300
                            }
                        }
                    }, {
                        name : 'what_now',
                        series : {
                            memutil : {
                                previous : 120,
                                mean : 140,
                                current : 130,
                                max : 190,
                                min : 70
                            },
                            time : {
                                previous : 350,
                                current : 330
                            }
                        }
                    }
                ]
            }
        ]});
    });


    page.on('updateProject', function(_, project) {
        page.emit('projectUpdated', null, project);
    });
    page.on('addProject', function(_, project) {
        project.id = String(Math.random());
        page.emit('projectAdded', null, project);
    });
    page.on('req_runs', function(_, projectId) {
        page.emit('res_runs', null, {
            projectId : projectId,
            runs : [
                {
                    id : '8888',
                    started : new Date().getTime(),
                    time : 1000,
                    modules : 2,
                    tests : 4
                }, {
                    id : '8808',
                    started : new Date().getTime(),
                    time : 900,
                    modules : 2,
                    tests : 4
                }
            ]
        });
    });
    page.on('req_project', function(_, projectId) {
        page.emit('res_project', null, {
            id : projectId,
            title : 'Project omg #' + projectId,
            repo : {
                type : 'git',
                url : 'git@github.com:omg/proj1'
            }
        });
    });
    page.on('req_projects', function(_, m) {
        page.emit('res_projects', null, [ {
                id : '3ttat',
                title : 'Project omg #1',
                repo : {
                    type : 'git',
                    url : 'git@github.com:omg/proj1'
                }
            }, {
                id : '3hsdg',
                title : 'Project omg #2000',
                repo : {
                    type : 'git',
                    url : 'git@github.com:omg/proj2'
                }
            }
        ]);
    });
    cb(null);
};