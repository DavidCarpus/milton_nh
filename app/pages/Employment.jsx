import React from 'react';
import {Link} from 'react-router';
import Aside from '../Components/Aside'
import { Grid, Row, Col } from 'react-bootstrap';

export default class Employment extends React.Component {
    render() {
        return (
            <div>
                <Col md={12}  id="contentArea"  >
                    <h1>Employment Opportunities</h1>
                    <hr/>
                    <Link to='/Parks'>Summer Recreation Positions</Link>
                </Col>
        </div>
        );
    }
}
