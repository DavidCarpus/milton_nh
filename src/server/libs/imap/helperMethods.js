
const groupNames = require('./GroupNames.json');
let cellCarriers = require('../../../libs/AlertRequests/cellCarriers.json')

//=======================================
function extractHeaderData(email) {
    let header = email.header.parts[0].body;
    return {from:header.from,subject:header.subject,to:header.to, date:email.header.attributes.date}
}

//=======================================
function getGroupNameFromTextLine(textLine) {

    let testLine = textLine.toUpperCase().split(' ').join(''); // Remove spaces from the line
    let foundGroup = groupNames.filter(group => {
        // console.log('group:', group, testLine);
        if (testLine == group.primary.toUpperCase()) {return true;}
        let alternatives = group.alternatives.filter(alternative => {
            if (testLine == alternative.toUpperCase()) {return true;}
        })
        if (alternatives.length > 0) {return true; }
        // console.log('alternatives:', alternatives);
        return false;
    })
    // console.log('foundGroup:', foundGroup);
    return foundGroup.length > 0 ? foundGroup[0].primary: null;
}
//=======================================
function isVideoLink(line) {
    if (line.match('HTTPS?:\/.*YOUTUBE.COM\/.*')) {
        return true;
    }
    if (line.match('HTTPS?:\/.*TOWNHALLSTREAMS.COM\/.*')) {
        return true;
    }
}
//=======================================
function hasURL(line) {
    return line.match(new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi))
}


//=======================================
function getRecordTypeFromLine(line) {
    let recordTypes = [
        {recordType: 'Agenda', searchMatches: ['AGENDA','AGENDAS'] },
        {recordType: 'Minutes', searchMatches: ['MINUTES'] },
        {recordType: 'Notice', searchMatches: ['^NOTICE$'] },
        {recordType: 'RFP', searchMatches: ['^RFP$', '^PUBLIC RECORD: ?RFP'] },
        {recordType: 'Document', searchMatches: ['DOCUMENT'] },
        {recordType: 'HelpfulLinks', searchMatches: ['HELPFULLINK', 'HELPFUL LINK'] },
        {recordType: 'PageText', searchMatches: ['PAGETEXT'] },
        {recordType: 'Menu', searchMatches: ['MENU ADD:?', 'ADD MENU:?','MENU DELETE:?', 'DELETE MENU:?'] },
        {recordType: 'User', searchMatches: ['USER ADD:?', 'ADD USER:?','USER DELETE:?', 'DELETE USER:?'] },
        {recordType: 'BoardCommittee', searchMatches: ['BOARD ADD:?', 'ADD BOARD:?','BOARD DELETE:?', 'DELETE BOARD:?'] },
        {recordType: 'AlertRequest', searchMatches: ['^.*: REQUESTED ALERT REGISTRATION'] },
        ]

    ucaseLine = line.toUpperCase().trim();
    if (isVideoLink(ucaseLine)) { return 'Video';}

    let matches = recordTypes.filter(type => {
        return  (type.recordType === ucaseLine) || type.searchMatches.reduce(function(sum, value) {
            return sum || (ucaseLine.search(new RegExp(value, 'i')) >= 0);
        }, false);
    })
    if (matches.length > 0) {
        return matches[0].recordType
    } else {
        return null;
    }
}
//=======================================
function getRequestTypeFromLine(line) {
    let requestTypes = [
        {requestType: 'ADD', searchMatches: [
            '^ADD$',
            'MENU ADD:?','ADD MENU:?','USER ADD:?','ADD USER:?','BOARD ADD:?','ADD BOARD:?',] },
        {requestType: 'REMOVE', searchMatches:[
            '^REMOVE$','^DELETE$',
            'MENU REMOVE:?','REMOVE MENU:?','USER REMOVE:?','REMOVE USER:?','BOARD REMOVE:?','REMOVE BOARD:?',
            'MENU DELETE:?','DELETE MENU:?','USER DELETE:?','DELETE USER:?','BOARD DELETE:?','DELETE BOARD:?',
            ] },
        {requestType: 'UPDATE', searchMatches: ['^UPDATE$'] },
        {requestType: 'REQUEST', searchMatches: ['^REQUEST$'] },
        {requestType: 'VALIDATE', searchMatches: ['^RE: REQUESTED ALERT REGISTRATION'] },
        ]

        ucaseLine = line.toUpperCase().trim();
        // console.log(ucaseLine);
        let matches = requestTypes.filter(type => {
            return  (type.requestType === ucaseLine) || type.searchMatches.reduce(function(sum, value) {
                return sum || (ucaseLine.search(new RegExp(value, 'i')) >= 0);
            }, false);
        })
        if (matches.length > 0) {
            return matches[0].requestType
        } else {
            return null;
        }
}
//=======================================
function getDateValueFromTextLine(line) {
    let ucaseLine = line.toUpperCase().trim();
    if (ucaseLine.search(new RegExp('^EXPIRE', 'i') ) >= 0) {
        line = line.replace(new RegExp('^EXPIRE.*?[ :]', 'i'), '')
        if (line.toUpperCase().trim().search(new RegExp('DAYS', 'i') ) >= 0) {
            dte = line;
        } else {
            const val = Number(line);
            if (isNaN(line)) {
                dte = Date.parse(line);
                // console.log('Date.parse:', dte);
            } else {
                dte = val + ' DAYS'
                // console.log('val:', dte);
            }
        }
        console.log({expire: dte});
        return {dateType:'expire', date: dte,}
    }

    if (ucaseLine.search(new RegExp('^DATE', 'i')) >= 0 ) {
        line = line.replace(new RegExp('^DATE.*?[ :]', 'i'), '')
        console.log('Date.parse(line):', line);
        dte = new Date(line);
        // dte = Date.parse(line);
        // console.log({date: dte});
        return {dateType:'date', date: dte,}
    }
    let chk = line.search(/^\d\d\d\d-\d\d-\d\d$/)
    if (chk != -1) {
        // console.log('match', line)
        dte = new Date(line);
        return {dateType:'date', date: dte,}
    }

    return null;
}

//=======================================
function extractDBData(email) {
    // console.log('email:' + require('util').inspect(email, { color:true, depth: null }));
    let header = email.header.parts[0].body;
    let bodyData = email.bodyData
    let emailSubject = header.subject[0].toUpperCase();

    let bodyLines = bodyData.split("\n");
    // console.log('bodyData:' + bodyData.replace(/ /g, '|'));

    let results = { mainpage: true, date: new Date(), requestType: 'ADD'};

    bodyLines.map( line=>{
        let originalLine = line;
        line = line.toUpperCase().trim();
        results.groupName = getGroupNameFromTextLine(line) || results.groupName || "";

        let tmpDate = getDateValueFromTextLine(line);
        if (tmpDate !== null) {
            results[tmpDate.dateType] = tmpDate.date
        }

        if(line.indexOf('MAINPAGE') >= 0 ) {
            if (line == 'MAINPAGE') {
                results.mainpage = true;
            } else if(line.indexOf('NO') >= 0 ) {
                results.mainpage = false;
            }
        }
        let recordtype = getRecordTypeFromLine(originalLine);
        if (recordtype != null ) {results.recordtype=recordtype}

        let requestType = getRequestTypeFromLine(originalLine);
        if (requestType != null ) {results.requestType=requestType}

        if (hasURL(line)) {            results.URL = line;        }


        let trimMatches = [
            {fieldName: 'description', searchMatches: [ '^DESC:? ','^DESCRIPTION:'] },
            {fieldName: 'term', searchMatches: [ '^TERM:'] },
            {fieldName: 'office', searchMatches: [ '^OFFICE:']},
            {fieldName: 'phone', searchMatches: [ '^PHONE:']},
            {fieldName: 'section', searchMatches: [ '^SECTION:']},
            {fieldName: 'email', searchMatches: [ '^EMAIL:']},
            {fieldName: 'menu', searchMatches: [ '^MENU ADD:', '^ADD MENU:',  '^BOARD ADD:', '^ADD BOARD:']},
            {fieldName: 'name', searchMatches: [ '^USER ADD:', '^ADD USER:', '^USER DELETE:', '^DELETE USER:']},
        ]
        let matches = trimMatches.filter(type => {
            return  (type.fieldName === line) || type.searchMatches.reduce(function(sum, value) {
                return sum || (line.search(new RegExp(value, 'i')) >= 0);
            }, false);
        })
        if (matches.length > 0) {
            results[matches[0].fieldName] = originalLine.replace(/.*\:/i,'').trim();
        }

    }) // bodyTextPart.map

    // Determine if header subject contains missing field data
    recordtype = getRecordTypeFromLine(emailSubject);
    if (recordtype != null ) {results.recordtype=recordtype}

    requestType = getRequestTypeFromLine(emailSubject);
    if (requestType != null ) {results.requestType=requestType}

    if(emailSubject.startsWith('RE:') >= 0 ) {
        // console.log('subject indicates PageText update');
        emailSubject = header.subject[0]; // We need the 'original'/before uppercase
        let subjectParts = emailSubject.replace('Re:','').trim().split("-");
        if (subjectParts.length === 2) {
            results.groupName = subjectParts[0].trim()
            results.section = subjectParts[1].trim()
            results.recordtype = 'PageText';
            results.requestType = 'UPDATE';
            results.bodyData = bodyData;
            // console.log('*********PageText:', results);
        }
    }

    results.groupName = getGroupNameFromTextLine(header.subject[0]) || results.groupName || "";
    if (results.groupName == '') { delete results.groupName; }

    if (results.expire && results.expire.toUpperCase().search(new RegExp('DAYS', 'i') ) >= 0) {
        let edate = new Date(results.date);
        edate.setDate(edate.getDate() + parseInt(results.expire.replace(new RegExp('DAYS', 'i'), '')));
        results.expire = edate
    }

    return results;
}
//=====================================
module.exports = {
    extractHeaderData,
    extractDBData,
    getGroupNameFromTextLine
}
