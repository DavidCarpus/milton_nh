import React from 'react';
import TaxMapForm  from './TaxMapForm'
import DocumentList  from './DocumentList'
import Aside from './Aside'

import { Col } from 'react-bootstrap';

export default class Assessing extends React.Component {

    render() {
        const onlineAssessmentButton= {
            backgroundColor: 'blue',
            color: 'white',
            width: '150px',
            height: '45px',
            fontSize: '2vmin',
            display:'inline-block',
            // float:'left',
            textAlign: 'center',
            borderRadius: '10px',
            background: 'radial-gradient(blue, grey)'
        }
        return (
            <div>
                <Col md={2}><Aside groupName={'Assessing'} /></Col>
                <Col md={10}  id="contentArea"  >
                    <h1 style={{textAlign:'center'}}>Assessing Department</h1>
                    <p>The Assessing Department is charged by State law with discovering, describing, and valuing real property for taxation purposes. The Department's job is diverse and involves the following responsibilities:</p>
                    <ul>
                        <li>Appraise and assess all real estate    </li>
                        <li>Monitor all sales and analyze the local real estate market </li>
                        <li>Maintain Property Record Card data </li>
                        <li>Administer Current Use Program </li>
                        <li>Oversee all Tax Exemption and Tax Credit Programs </li>
                        <li>Manage Timber Tax and Gravel Tax Programs </li>
                        <li>Assist taxpayers and the general public </li>
                        <li>Maintain Town's assessment roll by valuation of additions and new construction </li>
                        <li>Administer Tax Abatements </li>
                        <li>Provide assistance to other departments as needed </li>
                    </ul>
                    <div >
                        <div  style={{width:'48%'}}>
                            <a href='http://data.avitarassociates.com/logondirect.aspx?usr=milton&pwd=milton'>
                                <div  style={onlineAssessmentButton}>Assessment Data Review Online</div>
                            </a>
                        </div>
                        <TaxMapForm />
                    </div>

                    <DocumentList
                        groupName='Assessing'
                        title='Milton Assessors Documentation'
                        />
                    </Col>
            </div>

        );
    }
}
