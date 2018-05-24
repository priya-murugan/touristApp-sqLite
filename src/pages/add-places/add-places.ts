import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import {FormBuilder, FormGroup} from "@angular/forms";
import { PlacesListPage} from "../places-list/places-list"
import {PlacesProvider} from "../../providers/places/places";

@IonicPage()
@Component({
  selector: 'page-add-places',
  templateUrl: 'add-places.html',
})
export class AddPlacesPage {

    options: ImagePickerOptions;
   addPlaceForm : FormGroup;
   // placesList: any;

  constructor(public navCtrl: NavController,private imagePicker: ImagePicker,
              private platform: Platform,private sqlite: SQLite,
              private formBuilder: FormBuilder,
              private toast: Toast,
              public placesService: PlacesProvider) {
    this.addPlaceForm = this.formBuilder.group({
      location: [''],
      district: [''],
      state: [''],
      description: ['']
    });
    if (this.platform.is('cordova')) {
      this.sqlite.create({
        name: 'touristdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS place(id INTEGER PRIMARY KEY AUTOINCREMENT , place TEXT, district TEXT, state TEXT, description VARCHAR)', {})
          .then(res => {
            this.toast.show('Table Created', '5000', 'center').subscribe(
              toast => {
                this.navCtrl.popToRoot();
              }
            );
          })
          .catch(e => {
            this.toast.show('Table not Created', '5000', 'center').subscribe(
              toast => {
                console.log(toast);
              }
            );
          });
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacesPage');
  }
  selectImage(){
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
    }, (err) => { });
  }
  addPlace(addPlaceForm) {

    /* this.placesService.addPlaces(addPlaceForm.value).subscribe( data => {

     if(data){
     this.addPlaceForm.reset();
     this.toast.show('Place Added' , '5000', 'center').subscribe(
     toast => {
     console.log('Data saved');
     this.navCtrl.popToRoot();
     }
     );
     }
     });*/
      if (this.platform.is('cordova')) {
        this.sqlite.create({
          name: 'touristdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO place (place,district,state,description) VALUES(?,?,?,?)', [addPlaceForm.value.location, addPlaceForm.value.district,
          addPlaceForm.value.state,
          addPlaceForm.value.description])
          .then(res => {
            this.addPlaceForm.reset();
            // this.getPlacesList();
            console.log(res);
            console.log("Data inserted");
            this.toast.show("Data inserted", '5000', 'center').subscribe(
              toast => {
                console.log('Data saved');
                // this.navCtrl.popToRoot();
              }
            );
          })
          .catch(e => {
            console.log(e);
            this.toast.show(e.message, '5000', 'center').subscribe(
              toast => {
                console.log(toast);
              }
            );
          });
      });

    }
  }
/*  getPlacesList(){
    this.sqlite.create({
      name: 'touristdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM place ORDER BY id DESC', {})
        .then(res => {
          if (res.rows.length > 0) {
            this.placesList =[];
            for (var i = 0; i < res.rows.length; i++) {
              this.placesList.push({ location: res.rows.item(i).place, district: res.rows.item(i).district, state: res.rows.item(i).state,
                description: res.rows.item(i).description});
            }
          }
        })
        .catch(e => {
          console.log(e);
          this.toast.show('Data not saved', '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    });
    // this.navCtrl.push(PlacesListPage);
  }*/
  placeList(){
    this.navCtrl.push(PlacesListPage);
  }

}
