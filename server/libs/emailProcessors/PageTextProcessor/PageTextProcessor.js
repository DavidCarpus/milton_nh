var mysql = require('mysql');
var fs = require('fs');
var marked = require('marked');

var Config = require('../../../config'),
configuration = new Config();

var knexConfig = require('../../db/knexfile.js')
var knex = require('knex')(knexConfig[configuration.mode]);

var sendAutomationEmail = require('../common').sendAutomationEmail;

//=============================================
function validateData(requestedData) {
    let errors=[];
    if (! requestedData.DBData.section) {
        errors.push('Missing section in page text request for ' + requestedData.DBData.groupName)
    } else {
        let sectionName = translateSection(requestedData.DBData.section)
        if ( sectionName.length <= 0) {
            errors.push('Unknown section ' + (requestedData.DBData.section || '') + ' in request for text for ' + requestedData.DBData.groupName)
        }
    }

    return errors;
}
//=============================================
function translateSection(section) {
    switch (section.toUpperCase()) {
        case 'DESCRIPTION':
        case 'DESC':
            return 'desc'
        case 'TEXT':
        case 'TEXT1':
            return 'text1'
        default:
            throw new Error('Unknown page text section:', requestData.section)
    }
}
//===========================================
function translateToDBScheme(requestData) {
    let entry =  {pageLink: requestData.groupName || '',
        sectionName: translateSection(requestData.section.toUpperCase())
    }
    delete entry.requestType;
    delete entry.mainpage;
    delete entry.date;
    return entry;
}
//===========================================
function sendRequestedPageText(request, requestedData) {
    console.log('PageTextProcessor:sendRequestedPageText:'+ requestedData.pageLink + '-' + requestedData.sectionName);
    return sendAutomationEmail(request.header.from,  {
        subject: requestedData.pageLink + '-' + requestedData.sectionName,
        text: requestedData.markdown,
    })
    .then(emailResult => {
        console.log('emailResult:', emailResult);
        request.id = 0;
        return Promise.resolve([request]);
    })
}
//===========================================
function getCleanedTextBody(originalTextBody) {
    let bodyLines = originalTextBody.trim().split("\n");
    return bodyLines.map( line=>{
        let newLine = line;
        if (line === 'UPDATE' || line === 'PAGETEXT' || line.indexOf('Website automation') >= 0) {
            newLine = ''
        }
        newLine = newLine.replace(/^>/,'').trim()
        return newLine;
    }).join('\n')
}
//===========================================
class PageTextProcessor {
    process( requestData) {
        let errors  = validateData(requestData);
        if (errors.length > 0) {
            requestData.err = errors
            return Promise.resolve(requestData);
        }

        let action = requestData.DBData.requestType;
        let entry= translateToDBScheme(requestData.DBData)
        switch (action) {
            case 'REQUEST':
                return (knex('PageText').select().where(entry)
                .then(results => {
                    if (results.length > 0) {
                        return sendRequestedPageText(requestData, results[0])
                    } else {
                        return Promise.reject('Invalid Request')
                    }
                })
                )
            break;
            case 'UPDATE':
                let cleanText = getCleanedTextBody(requestData.DBData.bodyData);
                let updateFields = {
                    markdown: cleanText, // provided markdown
                    html: marked(cleanText) //markdown converted to HTML
                }

                return knex('PageText').update(updateFields).where(entry)
                .then( results => {
                    entry.id = 0;
                    entry.uid = requestData.uid; // We need to return this so IMAP subsystem can move/delete it.
                    console.log('Updated:', entry);
                    return Promise.resolve([entry]);
                });

            break;
            default:
                return Promise.reject(' *** Unknown PageTextProcessor action:' + action + ' for DBData:' + JSON.stringify(requestData));

        }
    }
}

module.exports.PageTextProcessor = PageTextProcessor;