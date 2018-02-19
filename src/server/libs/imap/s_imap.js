var imaps = require('imap-simple');
var fs      = require('fs');

const partIsAttachment = (part) => part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT'
const partIsPlainText = (part) => part.type == 'text' && part.subtype == 'plain'
const partIsHTML = (part) => part.type == 'text' && part.subtype == 'html'
const messageIDasFileName = (messageID) => messageID.replace('.','_').replace('@','_').replace('<','').replace('>','').trim()
//============================================================
function processMessages(credentials, processRoutine, mailbox='INBOX') {
    return imaps.connect( credentials )
    .then( sconnection => {
        return sconnection.openBox(mailbox)
        .then( box =>
            sconnection.search(['ALL'], { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], struct: true, envelope:true })
        )
        .then(messages =>{
            return Promise.all(messages.map(message => {
                var parts = imaps.getParts(message.attributes.struct);
                return Promise.all(parts.map( part =>
                    sconnection.getPartData(message, part)
                    .then(partData => {
                        if(partIsAttachment(part)){
                            return {
                                filename: part.disposition.params.filename,
                                tmpPath: configuration.PRIVATE_DIR + '/emailTmp/'
                                + messageIDasFileName(message.attributes.envelope.messageId)
                                + '_'+part.disposition.params.filename,
                                data : partData
                            }
                        }
                        else if (partIsPlainText(part)) {
                            return {
                                bodyData: partData.split('\n').map(line=>line.trim()).join('\n')
                            }
                        }
                        else if (partIsHTML(part)) {
                            return null
                        }
                        else {
                            console.log(' ****** Unknown email part ****',{type:part.type , subtype:part.subtype} );
                            return null
                        }
                    })
                ))
                .then(partsRetrieved =>{
                    // console.log('partsRetrieved', partsRetrieved.length);
                    // console.log('----------');
                    return partsRetrieved.filter(item=>item!==null).reduce( (acc, val) => {
                        if(typeof val.filename  !== 'undefined'){
                            acc.attachments.push(val)
                        }else {
                            acc = Object.assign({}, acc, val)
                        }
                        // console.log('acc', acc);
                        return acc
                    }, {header: message.attributes.envelope, seqNo: message.seqNo, attachments:[]} )
                })
                .then(allEmailDataRetrieved => {
                    // console.log('--------------------');
                    // console.log('allEmailDataRetrieved',allEmailDataRetrieved);
                    return Promise.all(allEmailDataRetrieved.attachments.map( attachment => {
                        return new Promise(function(resolve, reject) {
                            let writeStream = fs.createWriteStream(attachment.tmpPath);
                            writeStream.on('error', function (err) { reject(err); });

                            writeStream.on('open', function (fd) {
                                writeStream.write(attachment.data);
                                writeStream.end();
                            })
                            writeStream.on('finish', function () {
                                delete attachment.data;
                                resolve(attachment);
                            });
                        })
                    }))
                    .then( attachmentsWritten => Object.assign({}, allEmailDataRetrieved, {attachments:attachmentsWritten}) )
                })
                .then(readyToProcess => {
                    return processRoutine(readyToProcess)
                })
            }))
        })
    })
}
//===============================================
// =================================================
if (require.main === module) {
    const processEmailMessage = require('./processors/Processing').processEmailMessage
    var Config = require('../../config'),
    configuration = new Config();
    const credentials = {imap: configuration.imapProcess.imapcredentials}
    const stdout = (message) => console.log(JSON.stringify(message) + ',')

    if (process.argv[2] === 'stdout') {
        console.log('[');
        processMessages(credentials, stdout, "INBOX")
        .then( ()=>{
            console.log('{}]');
            return process.exit()
        })
    } else {
        processMessages(credentials, processEmailMessage, "INBOX") // "INBOX.Tests.Alerts"
        .then(messagesProcessed=> {
            // console.log('processed', messagesProcessed);
            messagesProcessed.map(messageResult => {
                const result = messageResult.filter(result=>typeof result.results !== 'undefined')
                if(result.length > 0){
                    // console.log('processed **',result[0].processor, '**\n',require('util').inspect(result[0].results, { depth: null, colors:true }));
                    console.log('processed ',require('util').inspect(result, { depth: null, colors:true }));
                }
            })
        })
        .then( ()=> process.exit() )
    }
}
