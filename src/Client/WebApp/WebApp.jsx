import React, { Component } from 'react';
import {    BrowserRouter as Router } from 'react-router-dom';
import { Route,Switch } from 'react-router-dom';

import MainLayout from '../Components/MainLayout/MainLayout'
import TransferStationRules from '../Components/TransferStationRules'
import Departments from '../pages/Departments';
import Committees from '../pages/Committees'
import Employment from '../pages/Employment';
import News from '../pages/News';
import Notice from '../pages/NoticePage';
import HomePage from '../pages/HomePage';
import About from '../pages/About';
import Calendar from '../pages/Calendar'
import ContactUs from '../pages/ContactUs'
import IndexPage from '../pages/IndexPage'
import PublicRecords from '../pages/PublicRecords'
import RequestAlerts from '../pages/RequestAlerts'
import Admin from '../pages/Admin'
import AdminSubmitChange from '../pages/Admin/SubmitChange'
import StaticPage from '../pages/StaticPage'
import FileViewer from '../pages/FileViewer'

class WebApp extends Component {
    componentWillMount() {
        this.props.fetchData();
    }

    CommitteesPage = (newProps) => {
        let  childProps = {Config: (this.props.Config)}
        // console.log(newProps);
        return (
            <MainLayout {...childProps}>
            <Committees
                fetchOUData={this.props.fetchOUData}
                store={this.props.store}
                {...newProps} {...childProps}
                />
        </MainLayout>

        );
    }

    DepartmentsPage = (newProps) => {
        let  childProps = {Config: (this.props.Config)}
        // console.log(newProps);
        return (
            <MainLayout {...childProps}>
                <Departments
                    fetchOUData={this.props.fetchOUData}
                    groupName={newProps.match.params.department}
                    store={this.props.store}
                    {...newProps} {...childProps}
                    />
            </MainLayout>
        );
    }

  render() {
    let  childProps = {Config: (this.props.Config)}
    return (
        <Router >
            <div>
                <Switch>
          <Route exact path="/" render={(newProps)=>(
                  <MainLayout {...childProps}>
                   <HomePage store={this.props.store} {...newProps} {...childProps} />
                   </MainLayout>
               )} />
            <Route path="/about" render={(newProps)=>(
                <MainLayout {...childProps}>
                <About store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
            <Route path="/calendar" render={(newProps)=>(
                <MainLayout {...childProps}>
                <Calendar store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
            <Route path="/ContactUs" render={(newProps)=>(
                <MainLayout {...childProps}>
                <ContactUs store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />

            <Route path="/Notice/:noticeID" render={(newProps)=>(
                <MainLayout {...childProps}>
                <Notice store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
        <Route path="/News/:newsID" render={(newProps)=>(
                <MainLayout {...childProps}>
                <News store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
            <Route path="/Employment" render={(newProps)=>(
                <MainLayout {...childProps}>
                <Employment store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
        <Route path="/ViewFile/:fileID" render={(newProps)=>(
                <MainLayout {...childProps}>
                <FileViewer store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />

            <Route path="/Index" render={(newProps)=>(
                <MainLayout {...childProps}>
                <IndexPage store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
            <Route path="/RequestAlerts" render={(newProps)=>(
                <MainLayout {...childProps}>
                    <RequestAlerts store={this.props.store} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
            <Route path="/TransferRules" render={(newProps)=>(
                <MainLayout {...childProps}>
                    <TransferStationRules store={this.props.store} group={this.props.groupData} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
            <Route path="/Departments/:department" render={this.DepartmentsPage} />
            <Route path="/BoardsAndCommittees/:committee" render={this.CommitteesPage} />
            <Route path="/PublicRecords" render={(newProps)=>(
                <MainLayout {...childProps}>
                    <PublicRecords store={this.props.store} group={this.props.groupData} {...newProps}  {...childProps}/>
                </MainLayout>
            )} />
            <Route exact path="/Admin" render={(newProps)=>(
                <MainLayout {...childProps}>
                    <Admin store={this.props.store} group={this.props.groupData} {...newProps}  {...childProps} ></Admin>
                </MainLayout>
            )} />
            <Route path="/Admin/SubmitChange" render={(newProps)=>(
                    <MainLayout {...childProps}>
                        <AdminSubmitChange store={this.props.store} group={this.props.groupData} {...newProps}  {...childProps} ></AdminSubmitChange>
                    </MainLayout>
                )} />
                <Route render={(newProps)=>(
                        <MainLayout {...childProps}>
                            <StaticPage store={this.props.store} group={this.props.groupData} {...newProps}  {...childProps} ></StaticPage>
                        </MainLayout>
                    )} />
            </Switch>
          </div>
        </Router>
    );
  }
}
/*
<Route exact path="/PublicRecords/:recordtype/:groupName" render={this.PublicRecordsPage} />
<Route path="/Admin/" render={(newProps)=>(
<MainLayout {...childProps}>
<Admin store={this.props.store} group={this.props.groupData} {...newProps}  {...childProps} ></Admin>
</MainLayout>
)} />

     <Route path="/TransferRules" render={this.DepartmentsPage} />
*/
export default WebApp;
