import React from 'react';
import {  Col } from 'react-bootstrap';

import Aside from '../Components/Aside'
import DocumentList  from '../Components/DocumentList'
import SmartLink from './SmartLink'


export default class CodeEnforcement extends React.Component {
    render() {
        var helpfulInformation = this.props.helpfulInformation || [];
        return (
            <div>
                <Col md={10}  mdPush={2} id="contentArea"  >
                    <h1 style={{textAlign:'center'}}>Code Enforcement</h1>
                    <p>Most inspections are conducted Tuesday's and Wednesday's and occasionally other days to accommodate the property owner. Applications and complaint forms can be picked up at the Town Hall Monday through Friday from 8:00 AM to 4:00 PM.</p>
                    <p>The Building Inspector is responsible for issuing all permits, (Building, Electrical, Plumbing, Mechanical, Occupancy, and Signs etc.) Applications for permits are received, plans are reviewed and if all codes and requirements are satisfied a fee is calculated and the permit will be issued to the applicant. For major and minor building permits, the Building Inspector has 7-10 days to review the permit.</p>
                    <p>The Code Enforcement Officer is responsible for the enforcement of all zoning and planning regulations. The CEO receives notice of violation by a written complaint submitted to the office, or by a visual inspection. Each written complaint received or discovered requires an appointment with the property owner to discuss and resolve any issues; if the issues can not be resolved a written Cease and Desist Order will be issued.</p>
                    <p>The Health Officer is responsible for all health inspections for schools, daycares facilities and foster homes. The majority of complaints received by the Health Officer are in regards to failed septic systems, mold issues, dead birds (EEE/WNV), and tenant/landlord disputes over health conditions. All complaints require appointments and inspections to resolve the issue.</p>
                    <p>Please call the Land Use Clerk at Town Hall between the hours of 8:00 AM and 4:00 PM Monday through Friday with any immediate concerns or questions.</p>

                    <h2>Helpful Information</h2>
                    {helpfulInformation.map((information, index) =>
                        <div key={information.id}><SmartLink link={information.fileLink} linkText={information.description} /></div>
                    )}

                    <DocumentList
                        group={this.props.group}
                         store={this.props.store}
                        title='Milton Code Enforcement Documentation'
                        />

                </Col>
                <Col md={2} mdPull={10}><Aside group={this.props.group} store={this.props.store} /></Col>
            </div>
        );
    }
}
/*


*/