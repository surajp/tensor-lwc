import { LightningElement, track } from 'lwc';
import {loadScript} from 'lightning/platformResourceLoader';
import tensorUrl from '@salesforce/resourceUrl/tensor';

export default class TensorLwc extends LightningElement {

    initComplete = false;

    sentence = 'You suck';
    @track analyzing = false;
    @track errorMessage;

    @track issues;

    handleSentenceChange(event){
        this.sentence = event.target.value;
    }

    callTensor(){
        this.issues=[];
        this.errorMessage='';
        this.analyzing = true;
        Tensor.toxicity.load(0.9).then(model=>{
            model.classify([this.sentence]).then(predictions=>{
                this.analyzing = false;
                this.issues = predictions.filter(pred=>pred.results[0].match===true)
                    .map(pred=>pred.label);
            }).catch(err=>{
                this.analyzing=false;
                this.errorMessage = err;
            })
        })
    }

    renderedCallback(){
        if(this.initComplete===true)
            return;
        this.initComplete = true;
        loadScript(this,tensorUrl)
            .then(()=>{
                this.callTensor();
            })
    }
}
