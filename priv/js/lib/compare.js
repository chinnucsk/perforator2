var t = require('./templates');
var v = require('valentine');
var qwery = require('qwery');
var bean = require('bean');
var step = require('step');
var bonzo = require('bonzo');
var moment = require('moment');
var series = require('./series');
series = series.series;

exports.init = function(page, cb) {
    page.handle(/^\/(.+)\/compare\/(.+)\/(.+)\/(.+)$/, function(from, to, params) {
        var state = {
            projectId : params[0],
            runIds : params[1].split('-'),
            moduleNames : params[2].split('-'),
            testNames : params[3].split('-')
        };
        var runs = [];
        v.each(state.runIds, function(_, i) {
            runs.push({
                projectId : state.projectId,
                runId : state.runIds[i],
                moduleName : state.moduleNames[i],
                testName : state.testNames[i]
            });
        });
        step(function() {
            var group = this.group();
            page.req('runs', null, state.projectId, group());
            v.each(runs, function(run) {
                page.req('testRun', null, run, group());
                page.req('modules', null, {
                    projectId : state.projectId,
                    runId : run.runId
                }, group());
                page.req('tests', null, {
                    projectId : state.projectId,
                    runId : run.runId,
                    moduleName : run.moduleName
                }, group());
            });
        }, function(_, group) {
            var runA = group[1].run;
            var modulesA = group[2].modules;
            var testsA = group[3].tests;

            var runB = group[4].run;
            var modulesB = group[5].modules;
            var testsB = group[6].tests;

            var numbers = [];
            v.each(series, function(series) {
                numbers.push({
                    series : series.name,
                    A : runA[series.key],
                    B : runB[series.key],
                    delta : runB[series.key] - runA[series.key]
                });
            });
            page.body.html(t.compare.render({
                runA : runA,
                runB : runB,
                modulesA : modulesA,
                modulesB : modulesB,
                runs : group[0].runs,
                testsA : testsA,
                testsB : testsB,
                commits : [
                    {
                        id : 'a8a7d85c8c',
                        shortDescription : 'implementing awesomeness'
                    },
                    {
                        id : 'a8a7d85c8c',
                        shortDescription : 'implementing awesomeness'
                    }
                ],
                numbers : numbers
            }));
            bonzo(qwery('#runA')).val(runs[0].runId);
            bonzo(qwery('#runB')).val(runs[1].runId);
            bonzo(qwery('#moduleA')).val(runs[0].moduleName);
            bonzo(qwery('#moduleB')).val(runs[1].moduleName);
            bonzo(qwery('#testA')).val(runs[0].testName);
            bonzo(qwery('#testB')).val(runs[1].testName);
            var change = function() {
                var runA = bonzo(qwery('#runA')).val();
                var runB = bonzo(qwery('#runB')).val();
                var moduleA = bonzo(qwery('#moduleA')).val();
                var moduleB = bonzo(qwery('#moduleB')).val();
                var testA = bonzo(qwery('#testA')).val();
                var testB = bonzo(qwery('#testB')).val();
                page.go('/' + state.projectId + '/compare/' + runA + '-' + runB + '/' + moduleA + '-' + moduleB + '/' + testA + '-' + testB);
            };
            v.each(qwery('select'), function(select) {
                bean.add(select, 'change', change);
            });
        });
    });
    cb();
};
