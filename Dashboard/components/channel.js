import React, { Component } from 'react';

import {ResourceList,ResourceListItem,Thumbnail,Checkbox ,Page, Card,Badge,AccountConnection,Link,Button,Layout,FormLayout,TextField, SettingToggle, TextStyle} from '@shopify/polaris';
import axios from 'axios';
import { observer } from "mobx-react"
import Modal from 'react-responsive-modal';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'
import {
    BrowserRouter as Router,
    Route,Redirect,
    NavLink
} from 'react-router-dom';

import DB from '../../base/adminstore';
var config = require('../settings');


@observer
export default class Channel extends Component {
    db = {};
    constructor(props) {
        super(props);
        this.db=DB;
        this.state= {newActivity: {},newService:{},creating:false};
      //  this.db = this.props.db;



    }
    componentDidMount() {

        this.getServices();

    }


    updateActivityStatus=(activity)=>{

        activity.enabled=!enabled;

        axios.post(config.api_url+'SupercreateActivity',activity)
            .then( (response)=> {

                this.getActivities( activity.ServiceId);

            })
            .catch( (error) =>{
                console.log(error);
            });


    }
    goBackServices=()=>{
        console.log('Acd');
        this.db.selectedService=null;
        this.db.selectedServiceActivities=[];
        this.db.addNewActionText='Add New Service';

        this.db.pageState=[];



    }
    getServices (){

        axios.get(config.api_url+'get-services')
            .then( (response)=> {
                let services =response.data.services.map(x=>{


                    return {

                        media: <Thumbnail
                            source={x.serviceImage}
                            alt={x.serviceName}
                        />,
                        attributeOne: x.serviceName,
                        attributeTwo: '',
                        actions: [{content: 'View Activities' , onClick:()=>{this.getActivities(x.id)}},
                            { content:'Edit', onClick: ()=>{this.showEditModalService(x)}   },
                            {content: 'Remove' , onClick:()=>{this.deleteMethod('S',x.id)}}],
                        persistActions: true,
                    }




                });

                this.db.services=services;

            })
            .catch( (error) =>{
                console.log(error);
            });

    }
    getActivities(id){


        this.db.selectedService=id;
        this.db.selectedServiceActivities=[];
        this.db.addNewActionText='Add new Activity';

        this.db.pageState=[{content: <div style={{cursor:'pointer'}} onClick={this.goBackServices}>Services</div> }];


        axios.get(config.api_url+'get-activities-by-service/'+id+'?showAll=1')
            .then( (response)=> {
                let selectedServiceActivities =response.data.activities.map(x=>{


                    return {

                        attributeOne: (<span>
                            <span style={{float: 'left'}} ><Checkbox

                                checked={x.isActive}

                            /> </span>
                            <span style={{width: '80%','float': 'right'}}>{x.activityName}</span></span>),
                        attributeTwo: x.activityText,

                        actions: [{content: 'Edit',onClick:()=>{
                                this.showEditModal(x)
                            }  },{content: 'Delete', onClick:()=>{this.deleteMethod('A',x.id)}}],
                        persistActions: true,
                    }




                })  ;

                this.db.selectedServiceActivities =selectedServiceActivities ;



            })
            .catch( (error) =>{
                console.log(error);
            });



    }
    updateSettings=(v,n)=>{

        let settings= Object.assign({},this.db.settings);


        settings[n]=v;

        this.db.settings= settings;

    }


    updateNewActivity=(v,n)=>{
        let newActivity= Object.assign({},this.state.newActivity);


        newActivity[n]=v;

        this.setState({newActivity});
    }
    updateNewService=(v,n)=>{
        let newService= Object.assign({},this.state.newService);


        newService[n]=v;

        this.setState({newService});
    }

    createnewActivity=(id)=>{


        let data= this.state.newActivity;
        data.ServiceId= this.db.selectedService;
        this.setState({creating:true});

        console.log(data);

        axios.post(config.api_url+'SupercreateActivity',data)
            .then( (response)=> {
                this.setState({creating:false});
                this.setState({newActivity: {}});
                this.getActivities( data.ServiceId);
                this.onCloseModal();
            })
            .catch( (error) =>{
                console.log(error);
            });



    }

    createnewService=(id)=>{
        this.setState({creating:true});

        let data= this.state.newService;


        console.log(data);

        axios.post(config.api_url+'SupercreateService',data)
            .then( (response)=> {
                this.setState({creating:false});

                this.onCloseModal();
                this.setState({newService: {}});
                this.getServices( );

            })
            .catch( (error) =>{
                console.log(error);
            });


    }

    deleteMethod = (type, id) => {


        confirmAlert({
            title: 'Warning!! ',                        // Title dialog
            message: 'Are you sure. do you want to delete?',               // Message dialog

            confirmLabel: 'Yes',                           // Text button confirm
            cancelLabel: 'No',                             // Text button cancel
            onConfirm: () => {

                if (type == 'S') {
                    axios.get(config.api_url + 'delete-service/' + id)
                        .then((response) => {
                            this.getServices()

                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
                else if (type == 'A') {
                    axios.get(config.api_url + 'delete-activity/' + id)
                        .then((response) => {
                            this.getActivities(this.db.selectedService);

                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }


            },    // Action after Confirm

        })


        return;


    };

    showEditModalService=(service)=>{

        this.setState({newService: service});

        this.db.ModalOpen=true;


    }
    showEditModal= (activity)=>{
        if(activity.isActive==1)
        {
            activity.enabled=true;
        }
        this.setState({newActivity: activity});

        this.db.ModalOpen=true;

    }



    onCloseModal=()=>{
        this.db.ModalOpen=false;
        this.setState({newActivity:{}});
    }

    modalContent= ()=>{

        if(this.state.newActivity.id)
        {

            return ( <FormLayout>
                <h2 style={{"fontSize": "22px","fontWeight": "bold"}}>Edit Activity</h2>
                <Checkbox
                    label="Active"
                    checked={this.state.newActivity.enabled}
                    onChange={(v) => this.updateNewActivity(v, 'enabled')}
                />
                <TextField
                    label="Activity Name"
                    type="Text"
                    spellCheck={true}
                    name={'activityName'}
                    value={this.state.newActivity.activityName}
                    onChange={(v) => this.updateNewActivity(v, 'activityName')}
                />
                <TextField
                    label="Activity Type"
                    type="Text"
                    spellCheck={true}
                    name={'activityType'}
                    value={this.state.newActivity.activityType}
                    onChange={(v) => this.updateNewActivity(v, 'activityType')}
                />
                <TextField
                    label="Activity Text"
                    type="Text"
                    spellCheck={true}
                    name={'activityText'} multiline={4}
                    value={this.state.newActivity.activityText}
                    onChange={(v) => this.updateNewActivity(v, 'activityText')}
                />






                <TextField
                    type="Number"
                    label="Activity Expiry"
                    suffix={"Days"}
                    name={'activityExpiry'}
                    value={this.state.newActivity.activityExpiry}
                    onChange={(v) => this.updateNewActivity(v, 'activityExpiry')}
                />


                <Button primary onClick={ ()=>{ this.createnewActivity(this.state.newActivity.id);}}
                        loading={this.state.creating}>Save</Button>




            </FormLayout>)

        }
        else if(this.db.addNewActionText=='Add new Activity'){
            return ( <FormLayout>
                <h2 style={{"fontSize": "22px","fontWeight": "bold"}}>Create new Activity</h2>
                <Checkbox
                    label="Active"
                    checked={this.state.newActivity.enabled}
                    onChange={(v) => this.updateNewActivity(v, 'enabled')}
                />
                <TextField
                    label="Activity Name"
                    type="Text"
                    spellCheck={true}
                    name={'activityName'}
                    value={this.state.newActivity.activityName}
                    onChange={(v) => this.updateNewActivity(v, 'activityName')}
                />
                <TextField
                    label="Activity Type"
                    type="Text"
                    spellCheck={true}
                    name={'activityType'}
                    value={this.state.newActivity.activityType}
                    onChange={(v) => this.updateNewActivity(v, 'activityType')}
                />
                <TextField
                    label="Activity Text"
                    type="Text"
                    spellCheck={true}
                    name={'activityText'} multiline={4}
                    value={this.state.newActivity.activityText}
                    onChange={(v) => this.updateNewActivity(v, 'activityText')}
                />






                <TextField
                    type="Number"
                    label="Activity Expiry"
                    suffix={"Days"}
                    name={'activityExpiry'}
                    value={this.state.newActivity.activityExpiry}
                    onChange={(v) => this.updateNewActivity(v, 'activityExpiry')}
                />


                <Button primary onClick={ ()=>{ this.createnewActivity();}}
                        loading={this.state.creating}>Create</Button>




            </FormLayout>)
        }
        else{

            if(this.state.newService.id)
            {
                return ( <FormLayout>
                    <h2 style={{"fontSize": "22px","fontWeight": "bold"}}>Edit Service</h2>

                    <TextField
                        label="Service Name"
                        type="Text"
                        spellCheck={true}
                        name={'serviceName'}
                        value={this.state.newService.serviceName}
                        onChange={(v) => this.updateNewService(v, 'serviceName')}
                    />
                    <TextField
                        label="Service Logo Url"
                        type="Text"
                        spellCheck={false}
                        name={'serviceImage'}
                        value={this.state.newService.serviceImage}
                        onChange={(v) => this.updateNewService(v, 'serviceImage')}
                    />


                    <Button primary onClick={ ()=>{ this.createnewService();}}
                            loading={this.state.creating}>Save</Button>




                </FormLayout>)

            }else {
                return ( <FormLayout>
                    <h2 style={{"fontSize": "22px", "fontWeight": "bold"}}>Create new Service</h2>

                    <TextField
                        label="Service Name"
                        type="Text"
                        spellCheck={true}
                        name={'serviceName'}
                        value={this.state.newService.serviceName}
                        onChange={(v) => this.updateNewService(v, 'serviceName')}
                    />
                    <TextField
                        label="Service Logo Url"
                        type="Text"
                        spellCheck={false}
                        name={'serviceImage'}
                        value={this.state.newService.serviceImage}
                        onChange={(v) => this.updateNewService(v, 'serviceImage')}
                    />


                    <Button primary onClick={() => {
                        this.createnewService();
                    }}
                            loading={this.state.creating}>Create</Button>


                </FormLayout>)
            }

        }


    }

    AddnewAction = () => {

        this.setState({newActivity:{},newService:{}});
        this.db.ModalOpen=true;
        console.log('wow');

    }

    renderBlock(){

        let renderblock= (this.db.selectedService==null)? this.db.services: this.db.selectedServiceActivities;


        return (<div>
            {this.db.selectedService==null ?
                <AccountConnection
                    title={'Allowed Sites'}
                    action={{content: 'config',onClick:()=>{
                        this.props.history.push('/admindashboard'+'/alowedsites')
                        }}}

                /> :''}
                <ResourceList
                items={renderblock}



                renderItem={(item, index) => {
                    return <ResourceList.Item key={index} {...item} />;
                }}

            /></div>
        );

    }

    render() {
        return (

                <div>


                    <Page
                        breadcrumbs={this.db.pageState}

                        title="Admin Dashboard"  primaryAction={{
                        content: this.db.addNewActionText,
                        onClick: this.AddnewAction

                    }}>
                    <style>{`.Polaris-ResourceList__AttributeTwo {
                    width: 50%;
                    }p.Polaris-ResourceList__AttributeOne {
                    width: 40%;
                    }.custom-modal{width:500px;}`}</style>

                        <Layout>
                            <Layout.AnnotatedSection
                                title="Services"
                                description="Here you can configure Services and Activities" >
                                <Card sectioned>

                                    {this.renderBlock()}

                                </Card>
                            </Layout.AnnotatedSection>
                        </Layout>

                    </Page>
                    <Modal  classNames={{ modal: 'custom-modal' }} little={true} open={this.db.ModalOpen} onClose={this.onCloseModal} >
                        {this.modalContent()}
                    </Modal>





                </div>

        );
    }
}


