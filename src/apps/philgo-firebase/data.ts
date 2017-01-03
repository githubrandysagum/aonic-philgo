//  constructor(@Inject(FirebaseApp) firebaseApp: any) {
import {  Injectable } from '@angular/core';
import { initializeApp, storage } from 'firebase';


/**
 * 
 * If file data is web browser file, 'blob', 'imageData' are not needed.
 * If file data is blob, then 'file.type' and 'file.name' must be set. 'base64' is not needed.
 * If file data is base64 data, 'file.type' and 'file.name' must be set. 'blob' is not needed.
 */
export interface FILE_UPLOAD {
  file: any;
  blob?: any;
  ref?: string;
  base64?: string;
}
export interface FILE_UPLOADED {
  url: string;
  ref: string;
}
@Injectable()
export class Data {
   
    storage: storage.Storage;
    constructor() {
      let config = {
        apiKey: "AIzaSyBnRU17u3RLZoFDkmvHL_gxNmvQxO9z5bA",
        authDomain: "philgofirebase.firebaseapp.com",
        databaseURL: "https://philgofirebase.firebaseio.com",
        storageBucket: "philgofirebase.appspot.com",
        messagingSenderId: "17096589698"
      };
  
    initializeApp(config);
    this.storage = storage(); // storage reference
     //storageRef.getDownloadURL().then(url => this.image = url);
     

  }

  upload( data: FILE_UPLOAD, successCallback: (uploaded:FILE_UPLOADED) => void, failureCallback: (error:string) => void, progressCallback?: ( percent: number ) => void ) {
  
    if ( data.ref === void 0 ) data.ref = Date.now() + '/' + data.file.name;

    let file = data.file;
    if ( data.blob !== void 0 ) file = data.blob;
    else if ( data.base64 !== void 0 ) file = this.b64toBlob( data.base64, data.base64 );

    console.log('file:', file);
    let task = this.storage.ref( data.ref )
      .put( file, {contentType: data.file.type});

    task.then( snapshot => {
      this.storage.ref( data.ref ).getDownloadURL().then( url => {
        let uploaded = { url: url, ref: data.ref };

        console.log("return url:", url );
        successCallback( uploaded );
      });
    })
    .catch( e => failureCallback( e.message ) );
   
    task.on( storage.TaskEvent.STATE_CHANGED, snapshot => {
     let percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
         progressCallback( percent );
    });
  }

  delete( ref: string, successCallback: () => void, failureCallback: (error:string) => void ) {
    console.log('delete() ref: ', ref);
    this.storage.ref().child( ref )
      .delete()
      .then( successCallback )
      .catch( e => {
        failureCallback( e.message );
    });
  }

  b64toBlob(b64Data, contentType='', sliceSize=512) {
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}