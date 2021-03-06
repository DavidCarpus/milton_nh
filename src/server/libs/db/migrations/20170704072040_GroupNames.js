var fs = require('fs');
var knexConfig = require('../knexfile.js')
var knexConnection = require('knex')(knexConfig['development']);


const DEFAULT_JSON_DIR='../../../../private/' + process.env.REACT_APP_MUNICIPALITY + '/json/';
var JSON_DIR=DEFAULT_JSON_DIR;
//======================================
function tableNameFromJSON(filename) {
    var basename = filename.replace('.json', '')

    switch (basename) {
        case 'GroupNames':
            return 'GroupNames';
        default:
            return '*** UNK table name for ' + basename;
        }
}
//======================================
function readJSONContent(jsonFile) {
    var filename = jsonFile.replace(/^.*[\\\/]/, '');
    filename = filename.replace('.json', '')
    return new Promise(function(resolve, reject) {
        var content = fs.readFile(jsonFile, (err, data) => {
            if (err)  reject(err)
            resolve(JSON.parse(data));
        });
    })
}
//======================================
function importGroupNames(knex = null) {
    var list = fs.readdirSync(JSON_DIR)

    return new Promise(function(resolve, reject) {
        resolve(Promise.all(list.filter(file => {return file.indexOf('GroupNames.json') >= 0}).map( (file) => {
            console.log("Processing " + file);
            return readJSONContent(JSON_DIR + file)
            .then(result => {
                // If primary not already in alternatives, add it
                let tableName = tableNameFromJSON(file);
                console.log('tableName:', tableName);
                return Promise.all(result.map(record=> {
                    let entry = {pageLink: record.primary}
                    if (record.alternatives.indexOf(record.primary) === -1) {
                        record.alternatives.unshift(record.primary)
                    }
                    return record
                }))
                .then(unique => {
                    // console.log('unique:' + require('util').inspect(unique, { depth: null }));
                    let insertPromises = []
                    unique.map(record=> {
                        record.alternatives.map(alternative => {
                            let entry = {pageLink: record.primary, groupName: alternative}
                            // let sql = knex('GroupNames').insert(entry).toString()
                            insertPromises.push(
                                knex('GroupNames').insert(entry)
                                .catch(err => {console.log('GroupNames import error:', err);})
                            )
                        })
                    })
                    return Promise.all(insertPromises)
                })
                return Promise.resolve(tableName)
            })
        })));
    })
}
//======================================
exports.up = function(knex, Promise) {
    console.log('Creating GroupNames Table')
    return knex.schema.createTableIfNotExists('GroupNames', function (table) {
      table.increments('id');
      table.text('pageLink');
      table.string('groupName');
  })  .then( created => {
        return importGroupNames(knex)}
    )
};

exports.down = function(knex, Promise) {
    console.log('Dropping GroupNames Table')
  return knex.schema.dropTableIfExists('GroupNames');
};
