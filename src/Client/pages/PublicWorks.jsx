import React from 'react';
import styles from './PublicWorks.css'
import { Col } from 'react-bootstrap';
import Aside from '../Components/Aside'
import NoticesList from '../Components/NoticesList'
import RawText from '../Components/RawText'

import SmartLink from '../Components/SmartLink'
import EB2ServiceBlock from '../Components/EB2ServiceBlock'
import TransferStationRules from '../Components/TransferStationRules'

export default class PublicWorks extends React.Component {
    render() {
        var group = this.props.group;
        console.log('PublicWorks:group',group);

        return (
            <div>
                <Col md={9}  mdPush={2} id="contentArea"  >
                    <h1 style={{textAlign:'center'}}>{group.description}</h1>

                        <RawText groupPageText={this.props.group.pagetext} block='description' />

                        <NoticesList group={group} groupName={group.link} store={this.props.store}/>

                        <SmartLink link='http://miltonnh-us.com/uploads/highway_30_2123914888.pdf'
                            linkText='ORDINANCE REGULATING HEAVY HAULING OVER TOWN ROADS'/>

                        <hr/>
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

                    <TransferStationRules group={group} />
                    <hr/>
                    <SmartLink link='/TransferRules'
                        linkText='Printable Transfer Station Rules'/>
                    <hr/>

                    <EB2ServiceBlock groupName={group.link}/>
                    Buy Transfer Station Stickers Online
                </Col>
                <Col md={2} mdPull={9}><Aside group={group} store={this.props.store} /></Col>
            </div>
        );
    }
}

/*
*/
