import { computed, observable } from "mobx"
import axios from "axios/index";

var config = require('../settings');
const p='consent@2017';

export class DataStore {

    @observable settings={enabled:false};
    @observable services=[];
    @observable selectedServiceActivities=[];
    @observable addNewActionText='Add New Service';
    @observable selectedService=null;
    @observable loading= false;
    @observable ModalOpen= false;
    @observable pageState= [];
    @observable sites= [];




    AddnewAction = () => {
        this.ModalOpen=true;
        console.log('wow');

        //
        // const incompleteTodos = this.todos.filter(todo => !todo.complete)
        // this.todos.replace(incompleteTodos)
    }
    onCloseModal= ()=>{
        this.ModalOpen=false;
    }

    setStatus(id,active,x){

        let data={
            id:id,
            active:!active
        };
        axios.post(config.api_url+'allow-site',data)
            .then( (response)=> {



                this.getSites( );
            })
            .catch( (error) =>{
                console.log(error);
            });

    }


    getSites (){

        axios.get(config.api_url+'get-sites')
            .then( (response)=> {
                let sites =response.data.map(x=>{


                    return {

                        attributeOne: x.store_name,
                        attributeTwo: '',
                        actions: [
                            {content: x.loading? '...':((x.active==1 )? 'Enabled':'Disabled'), loading:x.loading,
                                disabled: x.store_name.includes('.myshopify.com') ,
                                onClick:()=>{
                                    x.loading=true;
                                    this.setStatus(x.id,x.active,x);

                                }
                            }],

                        persistActions: true,
                    }




                });

                this.sites=sites;

            })
            .catch( (error) =>{
                console.log(error);
            });

    }

}

export default new DataStore