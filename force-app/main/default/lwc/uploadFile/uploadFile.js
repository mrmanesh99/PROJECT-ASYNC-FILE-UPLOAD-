import { LightningElement } from 'lwc';
import FileHandler from '@salesforce/apex/FileHandler.FileHandler';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class UploadFile extends LightningElement {
    fileitems;
    file;
    fileHandler(event){
        this.file=event.target.files[0];
        const reader=new FileReader();
        reader.onload=()=>{
            this.fileitems=reader.result;
            console.log("FILE ITEMS"+this.fileitems)
           this.csv= this.parseCSV(this.fileitems)
           this.records=JSON.stringify(this.csv);
           FileHandler({records:this.records})
           .then(result => {
            console.log(result);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Operation completed successfully!',
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            console.log(error);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body ? error.body.message : 'Something went wrong',
                    variant: 'error'
                })
            );
        });
        }
        reader.readAsText(this.file);
    
}
 parseCSV(csvText) {
    const lines = csvText.split(/\r?\n/);  
    const headers = lines[0].trim().split(',');

    let records = [];
                                                  
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;            
        let values = lines[i].split(',');             
        let obj = {};

        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim();
        });

        records.push(obj);
    }

    return records;
}


}