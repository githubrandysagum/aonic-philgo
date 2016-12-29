import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router'
import { formProcess } from '../../../etc/share';
import { Member, MEMBER_DATA, MEMBER_REGISTER_DATA, MEMBER_LOGIN } from '../../../api/philgo-api/v2/member';

@Component({
    selector: 'register-page',
    templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
    title: string = "Register";

    login: MEMBER_LOGIN = null;
    nickname : string = "...";
    memberData: MEMBER_DATA = null;
    
    form = < MEMBER_REGISTER_DATA > {};
    process = formProcess.reset();


    constructor(
        private member : Member,
        private router : Router
    ) {

        this.login = member.getLoginData();
        this.loadFormData();
     }

    ngOnInit() { }


    onClickRegister() {
        this.register();
    }


     loadFormData() {
        // don't check login here since, login is non-blocking code.
        this.member.data( (data:MEMBER_DATA) => {
            console.log(data);
            this.memberData = data;
          //  if ( data.user_url_primary_photo ) this.urlPhoto = data.user_url_primary_photo;
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
     register() {

       this.process.begin();    
       if(!this.validate()) return;

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
        this.process.begin();
         if(!this.validate()) return;

        this.member.update( this.form, login => {
             setTimeout(()=>this.process.setSuccess( "User profile updated!" ) ,345);
             setTimeout(()=>this.process.reset() ,5000);
             
        },
        error => {
            alert('error on update user profile: ' + error );
            setTimeout(()=>this.process.setError( error ),345);
        },
        () => {

        })
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

