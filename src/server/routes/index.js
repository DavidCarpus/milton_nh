var express = require('express');
var router = express.Router();              // get an instance of the express Router
var cors = require('cors');
var startOfMonth = require('date-fns/start_of_month')
var endOfMonth = require('date-fns/end_of_month');
var startOfWeek = require('date-fns/start_of_week')
var addWeeks = require('date-fns/add_weeks')
var addMonths = require('date-fns/add_months')

var knexConfig = require('../libs/db/knexfile.js')
var knex = require('knex')(knexConfig[ process.env.NODE_ENV || 'development']);

var mysql = require('mysql');
var fs = require('fs');
var mime = require('mime');
var marked = require('marked');
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var emailValidate = require("email-validator");

var addDays = require('date-fns/add_days')

var Config = require('../config');
configuration = new Config();
const privateDir = configuration.mode === 'development' ? '../../private/'+process.env.REACT_APP_MUNICIPALITY: '../../private/'

// var connection;
var mysql_pool = require('../libs/db/mysql').mysql_pool;

var {getGroupMeetingDocuments, getPublicDocDataWithAttachments, getPublicDocData, fetchPublicRecordPage, fetchPublicDocsDataFromDB} = require('../../libs/PublicDocs');
var {pullNewsListForGroup, pullNewsDetailsWithAttachmentMeta} = require('../../libs/News');
var {pullMenusFromDB} = require('../../libs/Menus');
var {pullGroupData} = require('../../libs/Groups');
var {pullLinksFromDB} = require('../../libs/Links');

var {submitAlertRequestData} = require('../libs/AlertRequests');
var {getHomeCalendarDateRange} = require('../libs/date');
var {pullAgendaIDFromDB, getCalendarDataForMonth, getCalendarDataForRange} = require('../libs/calendar/ICSCalendar');

router.use(cors());
// ==========================================================
function simpleDBQuery(query){
    return new Promise(function(resolve, reject) {
        // console.log('mysql_pool', mysql_pool);
        mysql_pool.getConnection(function(err, connection) {
    		if (err) {
    			connection.release();
    	  		reject(' Error getting mysql_pool connection: ' + err);
    	  		throw err;
    	  	}
            connection.query(query, function(err, rows){
                if (err) {
                    console.log(require('util').inspect(err, { depth: null }));
                    reject(err)
                }
                connection.release();
                resolve( rows);
            });
        })
    });
}
const cleanURI = (uri) => { // Merge references to parent directories
    return uri.replace(/\/[\w]+\/\.\./, '').replace(/\/[\w]+\/\.\./, '').replace(/\/[\w]+\/\.\./, '')
}

// ==========================================================
router.get('/Links', function(req, res) {
    pullLinksFromDB(knex)
    .then( toSend => {
        res.json(toSend.sort((a,b) =>  (a.desc > b.desc) ? 1 : ((b.desc > a.desc) ? -1 : 0) ) );
    })
});
// ==========================================================
router.get('/Menus', function(req, res) {
    pullMenusFromDB(knex)
    .then(groupedMenus =>{
        res.json(groupedMenus);
    })
});
// ==========================================================
router.get('/Asides/:groupName', function(req, res) {
    var query = "Select id, html as description, link from PageAsides where pageLink= '" +req.params.groupName +"' ";
         simpleDBQuery(query)
         .then(rows => {
            //  console.log('Asides:' + JSON.stringify(rows));
             res.json(rows);
         });
        //  res.json([]);
});
// ==========================================================
router.get('/CalendarEvents/:year/:month', function(req, res) {
    // this.services['calendar'].config
    if(req.app.get('processManagement'))
        console.log('******:',req.app.get('processManagement').getConfig('calendar'));
// https://www.thepolyglotdeveloper.com/2015/05/get-remote-html-data-and-parse-it-in-express-for-nodejs/
    let range = getHomeCalendarDateRange()
    if(req.params.year && req.params.month){
        range[0] = new Date(req.params.year,  req.params.month, 1)
        range[1] = addMonths(range[0], 1)
    }

    const addAgendaIDFromDB = (evt) => {
        return pullAgendaIDFromDB(evt.pageLink, evt.startDate).then(id=> {
            return Promise.resolve(Object.assign({}, evt, {agendaID:id}))
        })
    }

    getCalendarDataForRange(range[0], range[1])
    .then(events=> Promise.all(events.map(addAgendaIDFromDB)) )
    .then(withAddedAgendaID=> {
        res.json(withAddedAgendaID);
    })
    .catch(err=> console.log('err', err))
})
// ==========================================================
router.get('/NewsAttachment/:fileID', function(req, res) {
    getPublicDocDataWithAttachments(knex, "FileAttachments", req.params.fileID)
    .then(docData => {
        const fileToSend = docData.fileLink ||  docData.attachments[0].fileLink
        res.setHeader('Content-type', mime.lookup(fileToSend));
        res.download(fileToSend, fileToSend.replace(/^.*[\\\/]/, ''))
         // res.json(docData);
    })
})
// ==========================================================
router.get('/ViewFile/:fileID', function(req, res) {
    getPublicDocDataWithAttachments(knex, "FileAttachments", req.params.fileID)
    .then(docData => {
        const fileToSend =  docData[0].attachments[0].fileLink || docData[0].fileLink
        fs.readFile(fileToSend, function(err, contents) {
            res.json(Object.assign({},
                {
                    FileType:mime.lookup(fileToSend), id:req.params.fileID, path: fileToSend,
                    filename:fileToSend.replace(/^.*[\\\/]/, ''), Description:docData.recorddesc
                }
                ,{FileData:contents?contents.toString('base64'):""}
            ))
        });
     })
})
// ==========================================================
router.get('/SendFile/:fileID', function(req, res) {
    getPublicDocDataWithAttachments(knex, "FileAttachments", req.params.fileID)
    .then(docData => {
        const fileToSend = docData.fileLink ||  docData.attachments[0].fileLink
        res.setHeader('Content-type', mime.lookup(fileToSend));
        res.download(fileToSend, fileToSend.replace(/^.*[\\\/]/, ''))
         // res.json(docData);
    })
})
// ==========================================================
router.get('/fetchFile/:fileID', function(req, res) {
    getPublicDocData(knex, req.params.fileID)
    .then(docData => {
        const fileToSend = docData.fileLink ||  docData.attachments[0].fileLink
        res.setHeader('Content-type', mime.lookup(fileToSend));
        res.download(fileToSend, fileToSend.replace(/^.*[\\\/]/, ''))
        // res.sendFile(fileToSend)
         // res.json(docData);
    })
});
// ==========================================================
router.get('/EB2Services/:groupName', function(req, res) {
        if ( req.params.groupName == 'Home' || (req.params.groupName ==  'TownClerk')) {
            query = "Select * from ExternalServices where servicetype='EB2Service' ";
        }else {
            query = "Select * from ExternalServices where servicetype='EB2Service' and  pageLink= '" + req.params.groupName +"' ";
        }
         simpleDBQuery(query)
         .then(rows => {
            //  console.log('ExternalServices:' + JSON.stringify(rows));
             res.json(rows);
         });

});
// ==========================================================
router.get('/FAQ/:groupName', function(req, res) {
        query = "Select question, answer from FAQ where pageLink='"+ req.params.groupName + "' ";
         simpleDBQuery(query)
         .then(rows => {
            //  console.log('FAQ:' + JSON.stringify(rows));
             res.json(rows);
         })
         .catch(err => {
             // res.json('Error', JSON.stringify(err))
             console.log('Fetch data error');
             console.log(require('util').inspect(err, { depth: null }));
             res.status(404).json(err);
         });
});
// ==========================================================
router.get('/Records/NewsDetails/:id', function(req, res) {
    pullNewsDetailsWithAttachmentMeta(knex, req.params.id)
    .then(withAttachments => {
        res.json(withAttachments);
    });
})
// ==========================================================
router.get('/Records/News/:groupName', function(req, res) {
    pullNewsListForGroup(knex, req.params.groupName)
    .then(records => {
        res.json(records);
    });
})
// ==========================================================
router.get('/PublicRecordPage/:pageURL', function(req, res) {
    // console.log('req.query', req.params);
    fetchPublicRecordPage(knex, req.params.pageURL)
    .then( toSend => {
        // console.log('toSend', toSend);
        res.json(toSend);
    })
});
// ==========================================================
router.get('/Records/PublicDocs/filtered', function(req, res) {
    // console.log('req.query', req.query.recordType);
    fetchPublicDocsDataFromDB(knex, req.query, 100)
    .then( toSend => {
        res.json(toSend);
    })
});
// ==========================================================
router.get('/Records/Meetings/:groupName', function(req, res) {
    getGroupMeetingDocuments(knex,req.params.groupName)
    .then( toSend => {
        res.json(toSend);
    })
});

// ==========================================================
router.get('/GroupData/:groupName', function(req, res) {
    var groupName = req.params.groupName;
    pullGroupData(knex, groupName)
    .then( toSend => {
        // console.log('toSend',toSend);
        res.json(toSend);
    })
});

// ==========================================================
// ==========================================================
router.post('/AlertRequests/', function(req, res) {
    var data = req.body;
    submitAlertRequestData(data)
    .then(submission => {
        console.log('AlertRequests', require('util').inspect(submission, { depth: null }));
        res.json(submission);
    })
});

// ==========================================================
// ==========================================================
// module.exports =  {router, handleDisconnect};
module.exports =  {router};
