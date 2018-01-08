import React, { Component } from 'react';

import {ResourceList,ResourceListItem,Thumbnail,Checkbox ,Page, Card,Badge,AccountConnection,Link,Button,Layout,FormLayout,TextField, SettingToggle, TextStyle} from '@shopify/polaris';
import axios from 'axios';
import { observer } from "mobx-react"
import Modal from 'react-responsive-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'
import {
    BrowserRouter as Router,
    Route,
    NavLink
} from 'react-router-dom';

import AllowedSitesNew from './AllowedSitesNew';

import DB from '../../base/adminstore';
var config = require('../settings');


@observer
export default class AllowedSites extends Component {
    db = {};
    constructor(props) {
        super(props);
        this.db=DB;
        this.state= {newActivity: {},newService:{},creating:false};
        //  this.db = this.props.db;



    }
    componentDidMount() {

        this.db.getSites();

    }


    renderBlock(){

        let renderblock= this.db.sites;


        return (<ResourceList
                items={renderblock}



                renderItem={(item, index) => {
                    return <ResourceList.Item key={index} {...item} />;
                }}

            />
        );

    }

    addNewSite(){


        this.props.history.push('/admindashboard'+'/alowedsites/addnew');
    }



    render() {
        return (

            <div>


                <Page
                    breadcrumbs={[{content: <div  onClick={()=>{
                        this.props.history.push('/admindashboard');

                    }} style={{cursor:'pointer'}}>Services</div>
                    }]}

                    title="Allowed Sites"  primaryAction={{
                    content:'Add new Site',
                    onClick: ()=>{this.addNewSite();}

                }} >

                    <Layout>
                        <Layout.AnnotatedSection
                            title="Allow Sites"
                            description="Here you can configure Wordpress Sites and Allowed or disable there access" >
                            <Card sectioned>

                                <Route path="/admindashboard/alowedsites/addnew"  component={AllowedSitesNew} />
                                {this.renderBlock()}
                            </Card>
                        </Layout.AnnotatedSection>
                    </Layout>

                </Page>






            </div>

        );
    }
}


