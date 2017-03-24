import React from 'react';
import Aside from '../Containers/Aside'

import DocumentList  from '../Containers/DocumentList'
import GroupMembers from '../Containers/GroupMembers'
import AgendasAndMinutes from '../Containers/AgendasAndMinutes'

import SmartLink from './SmartLink'
import { Grid, Row, Col } from 'react-bootstrap';

import NoticesList from '../Containers/NoticesList'

class RawText extends React.Component {
    render() {
        var text1 = ''
        if (this.props.groupPageText && this.props.groupPageText.pagetext) {
            if (this.props.block in this.props.groupPageText.pagetext[0]) {
                    text1 =this.props.groupPageText.pagetext[0][this.props.block];
                    text1 =  {__html: text1}
            }
        }

        if (text1) {
            return (
                <p  dangerouslySetInnerHTML={text1} ></p>
            )
        }else {
            return (
                <p></p>
                )
        }
    }
}

export default class Committees extends React.Component {

    render() {
        var groupPageText = this.props.groupPageText
        var groupName = this.props.group.link || this.props.group.desc || 'missing desc'
        var groupLabel = this.props.group.desc || 'missing desc'

        return (
            <div>
                <Col md={10}  mdPush={2} id="contentArea"  >

                    <h1 style={{textAlign:'center'}}>{groupLabel}</h1>

                    <RawText groupPageText={groupPageText} block='desc' />
                    <RawText groupPageText={groupPageText} block='text1' />
                    <NoticesList groupName={groupName}/>
                    <GroupMembers groupName={groupName} title={groupLabel + ' Members'} />

                    <AgendasAndMinutes groupName={groupName} />

                    <DocumentList groupName={groupName} title={groupLabel + ' Documentation'} />
                </Col>
                <Col md={2} mdPull={10}><Aside groupName={groupName} /></Col>
            </div>
        );
    }
}
