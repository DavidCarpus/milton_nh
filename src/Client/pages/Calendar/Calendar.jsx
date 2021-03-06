import React from 'react';
import './Calendar.css'

export default class Calendar extends React.Component {
    render() {
        // const calendarURL='https://calendar.google.com/calendar/embed?src=townmiltonnh%40gmail.com&showTabs=0&height=600&showCalendars=0&bgcolor=%23FFFFFF&showPrint=0&ctz=America/New_York'
        // https://calendar.google.com/calendar/embed?showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=townmiltonnh%40gmail.com&amp;color=%23125A12&amp;ctz=America%2FNew_York'
        console.log("this.props:", this.props);
        // {this.props.Config.calendarURL}

        return (
            <div id="calendar" style={{textAlign:'center'}}>
                    <h1 style={{textAlign:'center'}}>{this.props.Config.municipalLongName} Calendar</h1>
                <iframe src={this.props.Config.calendarURL} title='Calendar' width='100%' height='400'/>
        </div>
        );
    }
}
