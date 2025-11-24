import { LightningElement } from 'lwc';

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