
import React, { Component } from 'react';
import { observer } from "mobx-react"

import DB from '../BaseStore/Store';
var config = require('../settings');


@observer
export default class AnnoucementBar extends Component {
    db = {};
    constructor(props) {
        super(props);
        this.db=DB;
        this.state= {classes: [],message:"You can override the text that appears in an alert too.",
            yesText: 'Learn More',
            noText :'Decline',

            creating:false};
        //  this.db = this.props.db;



    }

    componentDidMount() {


        let classes= ["ck-window ck-banner ck-type-info ck-theme-block ck-bottom ck-color-override--2142990394"];

        this.setState({classes});


        //  this.getSites();

    }
    renderBar(){

        return (
            <div role="dialog"  className={this.state.classes.join(' ')}>
                <span  className="ck-message">

                    {this.state.message}
                    <a className="ck-link" target="_blank">{this.state.yesText}</a>

                </span>
                <div className="ck-compliance">
                    <a aria-label="dismiss cookie message" role="button" className="ck-btn ck-dismiss">{this.state.noText}</a>
                </div>
            </div>

        );

    }

    render() {
        return (
            <div>
            {this.renderBar()}

            </div>

        );
    }
}



