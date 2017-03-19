import React from 'react';
import ReactDOM from 'react-dom';
import { Navbar, NavItem, MenuItem, MenuItemLink, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styles from './Menu.css'

import organizations from './Data/OrganizationalUnits.json'
var departments = organizations.filter( (organization)=>
            {return organization.mainMenu == 'Departments' } )
var committees = organizations.filter( (organization)=>
            {return organization.mainMenu == 'Committees' } )

export default class Menu extends React.Component {
    logoLink = () => {
        return 'images/MiltonSeal.png'
    }
    render(){
        const logo = {height: '90px'};
        return (
            <Navbar collapseOnSelect
                id='custom-bootstrap-menu'
                >
            <Navbar.Header>
                <Navbar.Brand>
                  <a href="#" style={logo}>
                      <img
                          className={styles.logo}
                          src={this.logoLink()}
                          />
                  </a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>

            <Navbar.Collapse>
                <Nav  className={styles.myNavbar} >
                    <LinkContainer to="/about">
                        <NavItem eventKey={1} >About</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/calendar">
                        <NavItem eventKey={2} >Town Calendar</NavItem>
                    </LinkContainer>

                    <NavDropdown eventKey={3} title="Departments" id="basic-nav-dropdown">
                        {departments.map((department, index) =>
                             <DepartmentMenuLink  department={department} eventKey={department.id} key={3+index}/>
                            )}
                    </NavDropdown>
                    <NavDropdown eventKey={4} title="Committees" id="basic-nav-dropdown">
                        {committees.map((committee, index) =>
                            <CommitteeMenuLink  committee={committee} eventKey={committee.id}  key={10+index}/>
                            )}
                    </NavDropdown>

                </Nav>
            </Navbar.Collapse>
            </Navbar>
        );
    }
}
class MenuLink extends React.Component {
    render() {
        var link = this.props.link.replace(' ','')
        var desc = this.props.desc
        var routedPath = this.props.routePath + link
        return (
            ( !link.startsWith('http')) ?
            <LinkContainer to={routedPath}>
                <MenuItem
                    eventKey={this.props.eventKey}
                     className={styles.navItem}>{this.props.eventKey} - {desc}</MenuItem>
            </LinkContainer>
            : <Navbar.Text>
                    <Navbar.Link href={link}
                    target="_blank">{desc}</Navbar.Link>
                </Navbar.Text>
        )
    }
}
// eventKey={this.props.eventKey}

class DepartmentMenuLink extends React.Component {
    render() {
        var routePath= '/Departments/'
        var desc=this.props.department.desc
        var link=this.props.department.link || desc
        return (
            <MenuLink
                    link={link}
                    routePath={routePath}
                    eventKey={this.props.eventKey}
                    desc={desc}/>
        )
    }
}

class CommitteeMenuLink extends React.Component {
    render() {
        var routePath= '/BoardsAndCommittees/'
        var desc=this.props.committee.desc
        var link=this.props.committee.link || desc
        return (
            <MenuLink
                    link={link}
                    routePath={routePath}
                    eventKey={this.props.eventKey}
                    desc={desc}/>
        )
    }
}
// render() {
// return (
//         <MenuLink
//             lnk={('link' in this.props.committee)
//                 ? '/BoardsAndCommittees/' + this.props.committee.link
//                 :'/BoardsAndCommittees/' + this.props.committee.desc}
//             eventKey={this.props.eventKey}
//             desc={this.props.committee.desc}/>
// )
// }

/*
Town meeting info (Calendar)
About
BOS
Employment
Photos
Site map
Search

Contact us
Residents
Business
*/
