import React from 'react';
import EB2ServiceBlock from './EB2ServiceBlock'

export default class OnlinePaymentsBlock extends React.Component {
    render() {
        // const onlineAssessmentButton= {
        //     backgroundColor: 'blue',
        //     color: 'white',
        //     width: '180px',
        //     height: '3em',
        //     display:'inline-block',
        //     textAlign: 'center',
        //     borderRadius: '10px',
        //     background: 'radial-gradient(blue, grey)'
        // }
        return (
            <div id='eb2govBlock'>
                <h2>Follow the links for Dog Licensing, Online Registration, Vital Records or Property Taxes.</h2>
                <EB2ServiceBlock groupName={'Home'}/>


            </div>
        );
    }
}
/*
<a href='https://nhtaxkiosk.com/?KIOSKID=MILTON' target='_blank' rel="noopener noreferrer">
    <div style={onlineAssessmentButton}>
        <p>Property Taxes<br/>Review/Pay Online</p></div>
</a>
*/
