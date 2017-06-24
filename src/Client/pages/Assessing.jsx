import React from 'react';
import { Col } from 'react-bootstrap';

import  './Assessing.css'
import Aside from '../Components/Aside'
import DocumentList  from '../Components/DocumentList'
import RawText from '../Components/RawText'
import TaxMapForm  from '../Components/TaxMapForm'

export default class Assessing extends React.Component {

    render() {
        var group = this.props.group;
        var groupPageText = [];
        if (Array.isArray(group.pagetext)) {
            groupPageText = group.pagetext[0];
        }

        return (
            <div>
                <Col md={10}  mdPush={2} id="contentArea"  >
                    <h1 style={{textAlign:'center'}}>Assessing Department</h1>
                    <RawText groupPageText={groupPageText} block='text1' />

                    <div >
                        <div  style={{width:'48%'}}>
                            <a href='http://data.avitarassociates.com/logondirect.aspx?usr=milton&pwd=milton'>
                                <div  className="onlineAssessmentButton">Assessment Data Review Online</div>
                            </a>
                        </div>
                        <TaxMapForm />
                    </div>

                    <DocumentList
                        group={group}
                        groupName={group.link}
                        store={this.props.store}
                        title='Milton Assessors Documentation'
                        />
                    </Col>
                    <Col md={2} mdPull={10}>
                        <Aside
                            group={group}
                            store={this.props.store}
                            />
                    </Col>
            </div>

        );
    }
}