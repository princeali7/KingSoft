import React, { Component } from 'react';

import {ResourceList,ResourceListItem,Thumbnail,Checkbox ,Page, Card,Badge,AccountConnection,Link,Button,Layout,FormLayout,TextField, SettingToggle, TextStyle} from '@shopify/polaris';
import axios from 'axios';
import { observer } from "mobx-react"

import DB from '../../base/adminstore';
var config = require('../settings');


@observer
export default class AllowedSitesNew extends Component {
    db = {};
    constructor(props) {
        super(props);
        this.db=DB;
        this.state= {newSite: {},newService:{},creating:false};
        //  this.db = this.props.db;



    }
    componentDidMount() {

      //  this.getSites();

    }


    createnewSite=()=>{


        let data= this.state.newSite;
        this.setState({creating:true});


        axios.post(config.api_url+'add-new-site',data)
            .then( (response)=> {
                this.setState({creating:false});

                this.db.getSites();
                this.props.history.push('/admindashboard'+'/alowedsites');
            })
            .catch( (error) =>{
                console.log(error);
            });



    }

    updateNewSite=(v,n)=>{
        let newSite= Object.assign({},this.state.newSite);


        newSite[n]=v;

        this.setState({newSite});
    }


    render() {
        return (

            <FormLayout>
                <h2 style={{"fontSize": "22px","fontWeight": "bold"}}>Add New Site</h2>
                <Checkbox
                    label="Active"
                    checked={this.state.newSite.active}
                    onChange={(v) => this.updateNewSite(v, 'active')}
                />
                <TextField
                    label="Site Url"
                    type="Text"
                    spellCheck={true}
                    name={'store_name'}
                    value={this.state.newSite.store_name}
                    onChange={(v) => this.updateNewSite(v, 'store_name')}
                />


                <Button primary onClick={ ()=>{ this.createnewSite();}}
                        loading={this.state.creating}>Save</Button>




            </FormLayout>

        );
    }
}


