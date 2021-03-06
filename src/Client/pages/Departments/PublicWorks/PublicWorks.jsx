import React from 'react';
import { Col, Row } from 'reactstrap';

import NoticesList from '../../../Components/NoticesList'
import RawText from '../../../Components/RawText'

import SmartLink from '../../../Components/SmartLink'
import EB2ServiceBlock from '../../../Components/EB2ServiceBlock'
import TransferStationRules from '../../../Components/TransferStationRules'
import GroupMembers from '../../../Components/GroupMembers'
import {PageNavbar} from '../../../Components/PageNavbar'

import styles from './PublicWorks.css'

function pageNav() {
    return (
    <PageNavbar menus={[
        {text:'^^^', target:'primary-content-top'},
        {text:'Rules', target:'TransferStationRules-bookmark', fontAwsomeIcon:'fa-file-text'},
        {text:'Contact', target:'groupMembers-bookmark', fontAwsomeIcon:'fa-address-book'}
        ]}/>
    )
}

export default function PublicWorks({group, store, loading, id, title='Code Enforcement'}){
    return (
        <Row id='PublicWorks'>
            {pageNav()}

            <Col  md={{size:10, push:1}}>
                <div className="blockSection">
                    <h1 style={{textAlign:'center'}}>{group.description}</h1>
                    <RawText groupPageText={group.pagetext} block='description' />
                </div>

                <NoticesList group={group} groupName={group.link} store={store}/>

                <div className="blockSection">
                    <SmartLink link='http://miltonnh-us.com/uploads/highway_30_2123914888.pdf'
                        linkText='ORDINANCE REGULATING HEAVY HAULING OVER TOWN ROADS'/>
                </div>

                <div className="blockSection">
                <h2>Transfer Station</h2>
                <p>
                    603-652-4125
                    Friday- Monday 7am- 3pm
                    (last load accepted at 2:45pm) Closed Holidays
                </p>
                <div className={styles.transferMission}>
                    <h3>"If You Don't Know--Don't Throw, Please Ask"</h3>
                    <h3>Misson Statement</h3>
                    <p>At the Milton Transfer Station our goal is to create a polite and friendly atmosphere while committing to a superior level of service to assist the residents in their recycling and disposal needs.</p>
                </div>
            </div>

                <TransferStationRules group={group} />
                    <div className="blockSection">
                    <SmartLink link='/TransferRules' linkText='Printable Transfer Station Rules'/>
                    <br/>
                    <EB2ServiceBlock groupName={group.link}/>
                    Buy Transfer Station Stickers Online
                </div>
                <GroupMembers group={group}  title={' Contacts'}  showTerm={false} />

            </Col>
    </Row>
    );
}
