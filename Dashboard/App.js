import React, { Component } from 'react';
import {ResourceList,ResourceListItem,Thumbnail,Checkbox ,Page, Card,Badge,AccountConnection,Link,Button,Layout,FormLayout,TextField, SettingToggle, TextStyle} from '@shopify/polaris';

import { EmbeddedApp } from '@shopify/polaris/embedded';
import './App.css';
import axios from 'axios';
import { observer } from "mobx-react";
import AnnoucementBar from './components/annoucementbar.js';
var config = require('./settings.json');


@observer
export default class App extends Component {
      db = {};
    constructor(props) {
        super(props);
    }


  render() {
      const { apiKey, shopOrigin } = window;

      return (
          <EmbeddedApp shopOrigin={shopOrigin} apiKey={apiKey} forceRedirect={false}>
              <Page
                  title="One App to Rule Theme All"
                  breadcrumbs={[{ content: 'Home', url: '/' }]}
                  primaryAction={{ content: 'Add something' }}
              >
                  HELLO THIS IS BOILER PLATE
              </Page>
          </EmbeddedApp>
      );
  }
}


