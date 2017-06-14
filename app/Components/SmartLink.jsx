import React from 'react';
import { Link } from 'react-router'
import styles from '../Styles/SmartLink.css'
var Config = require('../config'),
configuration = new Config();

export default class SmartLink extends React.Component {
    render(){
        // var url=this.props.link;
        var lnk = this.props.link || ''
        var text = this.props.linkText
        var lnkStyle={}
        if (lnk.endsWith('pdf')) {
            lnkStyle=styles.pdf_link
        }
        if (lnk.includes('youtube.com')) {
            lnkStyle=styles.youtube_link
        }
        // lnkStyle=styles.pdf_link

        if (lnk.length == 0 ){
            return (<i
                className={lnkStyle}
                >
                {this.props.linkText}
            </i>)
        } else if (lnk.startsWith('http')) {
            return (<a
                className={lnkStyle}
                href={lnk}>{this.props.linkText}</a>)
        } else {
            // TODO: Add link/call to 'downloader'
            if (lnkStyle==styles.pdf_link) {
                lnk = configuration.ui.ROOT_URL + 'fetchfile/' + this.props.id;
                return (<a
                    className={lnkStyle}
                    href={lnk}>{this.props.linkText}</a>)
            }
            return(<Link  className={lnkStyle} to={lnk}>{this.props.linkText}</Link >)
        }
    }
}
//className={styles.pdf_link}
