import { Component, OnInit, NgZone } from '@angular/core'; 
import { Router } from '@angular/router'
import { formProcess } from '../../../etc/share';
import { Member, MEMBER_DATA, MEMBER_REGISTER_DATA, MEMBER_LOGIN } from '../../../api/philgo-api/v2/member';
import { Data } from '../../../data';


export let picturedescriptionData = {
    photoURL: '',
    description: '',
    photoREF: ''
}

@Component({
    selector: 'register-page',
    templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
    title: string = "Register";
    urlPhoto : string = "./assets/img/anonymous.gif";
    photoUploaded : boolean = false;

    login: MEMBER_LOGIN = null;
    nickname : string = "...";
    memberData: MEMBER_DATA = null;
    
    form = < MEMBER_REGISTER_DATA > {};
    process = formProcess.reset();

    validEmail = true;

    position = 0;
    file_progress = null;
    photo = picturedescriptionData; 

    old_photo_ref = [];
    new_photo_ref = [];
    constructor(
        private member : Member,
        private router : Router,
        private file : Data,
        private ngZone: NgZone
    ) {

        this.login = member.getLoginData();
        this.loadFormData();
     }

    ngOnInit() { }


   


     loadFormData() {
        // don't check login here since, login is non-blocking code.

       
        this.member.data( (data:MEMBER_DATA) => {
            console.log(data);
            this.memberData = data;
            if ( data.varchar_1 ) this.urlPhoto = data.varchar_1;
            this.form.name = data.name;
            this.nickname = data.nickname;
            this.form.email = data.email;
            this.form.gender = data.gender;
            this.form.mobile = data.mobile;
            this.form.birthday = this.member.getBirthdayFormValue( data );
         
        }, error => {
            console.log('error: ', error);
           
        });
        
    }

     onClickRegister() {
        if(!this.validate()) return;    
        this.register();
    }



    register() {

        this.process.begin();     
        this.member.register( this.form, (login) => {
            // register success
            console.log('onClickRegister(), registration sucess: ', login );
            setTimeout(()=>this.process.setSuccess( "User is Registered!" ) ,345);
            setTimeout(()=> this.router.navigate(['/']), 345);
            //
        },
        e => {
            console.log("onClickRegister() error: " + e);
            setTimeout(()=>this.process.setError( e ),345);
        });
    }

    onClickUpdate() {
         if(!this.validate()) return;
         this.update();
    }
    
    update(){
         this.process.begin();        
         this.member.update( this.form, login => {
             setTimeout(()=>this.process.setSuccess( "User profile updated!" ) ,345);
             setTimeout(()=>this.process.reset() ,5000);    
        },
        error => {
            alert('error on update user profile: ' + error );
            setTimeout(()=>this.process.setError( error ),345);
        },
        () => {})
    }

    onkeyupEmail(){   
        if(!this.validateEmail(this.form.email)){
            setTimeout(()=> this.validEmail = false, 345);
            return;
        }
         setTimeout(()=> this.validEmail = true, 345);   
    }
    

    onChange($event){
     
        let file = $event.target.files[0];
        console.log("Console:file: ",file);
        if( file == void 0) return;
        this.file_progress = true;
        let ref = 'photo/' + Date.now() + '/' + file.name;

        this.file.upload( { file: file, ref: ref }, uploaded=>{  
            this.onFileUploaded( uploaded.url, uploaded.ref );   
        }, error=>{
            alert('Error'+ error);
        },
        percent=>{    
            this.renderPage();    
            this.position = percent;     
        } );


    }

    renderPage() {
        this.ngZone.run(() => {
            console.log('ngZone.run()');
        });
    }

    deleteOldPhotos(){

    }

    deleteNewPhotos(){


    }

    deletePhoto(ref : string){
        this.file.delete(ref,()=> console.log("photo deleted"), error => console.log('Error deleting photo'))
    }


    onFileUploaded( url, ref){
        this.form.varchar_1 = this.urlPhoto;
       
     //   this.old_photo_ref.push(this.urlPhoto);
      //  this.new_photo_ref.push(ref);
        
        this.file_progress = false;
        this.urlPhoto = url;
        this.photo.photoURL = url;

        
        this.photo.photoREF = ref;
        this.photoUploaded = true;
        this.renderPage();
    }

    validate() : boolean{
        if(this.isNull(this.form.id) && !this.login){
            setTimeout(()=>this.process.setError( "ID is empty !" ),345);
            return false;
        }

        if(this.isNull(this.form.password) && !this.login){
            setTimeout(()=>this.process.setError( "Password is empty !" ),345);
            return false;
        }

        if(this.isNull(this.form.name)){
            setTimeout(()=>this.process.setError( "is empty !" ),345);
            return false;
        }

         if(this.isNull(this.form.nickname) && !this.login){
            setTimeout(()=>this.process.setError( "Nickname is empty !" ),345);
            return false;
        }

        if(this.isNull(this.form.email)){
            setTimeout(()=> this.process.setError( "Email is empty !" ), 345);
            return false;
        }

         if(!this.validateEmail(this.form.email)){
            setTimeout(()=> this.process.setError( "Email format is not valid !" ), 345);
            return false;
        }
          if(this.isNull(this.form.mobile)){
            setTimeout(()=>this.process.setError( "Mobile is empty !" ),345);
            return false;
        }
       
        if(this.isNull(this.form.gender)){
            setTimeout(()=>this.process.setError( "Choose  gender !" ),345);
            return false;
        }

        if(this.isNull(this.form.birthday)){
            setTimeout(()=>this.process.setError( "Input  birthdate !" ),345);
            return false;
        }

       

        return true;
       
    }

    validateEmail(email : string) : boolean {
        let email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         return email_regex.test(email);
    }

   

    isNull(form_input : string) : boolean{    
        return !form_input;
    }



}

