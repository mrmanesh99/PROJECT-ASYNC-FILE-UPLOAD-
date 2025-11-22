import { LightningElement } from 'lwc';

export default class UploadFile extends LightningElement {
    fileitems;
    file;
    fileHandler(event){
        this.file=event.target.files[0];
        const reader=new FileReader();
        reader.onload=()=>{
            this.fileitems=reader.result;
        }
        reader.readAsText(this.file);

        

}}