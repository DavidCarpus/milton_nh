let mode=process.env.INIT_MODE || process.env.NODE_ENV||'development'
const privateDir = mode === 'development' || process.env.DEV_MACHINE ?
__dirname+'/../../private/'+process.env.REACT_APP_MUNICIPALITY:
__dirname+'/../private/'

const credentialsDir = mode === 'development' || process.env.DEV_MACHINE ? '../../credentials/'+process.env.REACT_APP_MUNICIPALITY: '../credentials/'

var base_configuration = require(privateDir +'/configuration.json');
var dev_configuration = require(privateDir +'/configuration_dev.json');
var prod_configuration = require(privateDir +'/configuration_prod.json');
var test_configuration = require(privateDir +'/configuration_test.json');

var dev_credentials = require(credentialsDir +'/configuration_dev.json');
var prod_credentials = require(credentialsDir +'/configuration_prod.json');
var test_credentials = require(credentialsDir +'/configuration_test.json');

//======================================
//======================================
// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
//======================================
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
//======================================
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
 function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
//======================================
//======================================

//======================================
// mode='test'
// console.log(__dirname);

module.exports = function(){
    let mergedConf = mergeDeep({}, base_configuration);
    mergedConf = mergeDeep(mergedConf, {
        mode: mode,
        ATTACHMENT_DIR:__dirname + '/' + mergedConf.attachmentPath,
        ROOT_DIR: __dirname ,
        PRIVATE_DIR : privateDir
    });

    switch(mode){
        case 'development':
            // console.log(mergeDeep(mergedConf, dev_configuration, dev_credentials  ));
            return mergeDeep(mergedConf, dev_configuration,dev_credentials );
        case 'production':
            return mergeDeep(mergedConf, prod_configuration,prod_credentials );
        case 'test':
            return mergeDeep(mergedConf, test_configuration,test_credentials );
        // default:
        //     return dev_configuration;
    }
};
