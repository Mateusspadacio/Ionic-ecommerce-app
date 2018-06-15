import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { Camera } from '@ionic-native/camera';
import { Ng2ImgMaxModule } from 'ng2-img-max';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    Ng2ImgMaxModule,
    IonicPageModule.forChild(ProfilePage),
  ],
  providers: [Camera]
})
export class ProfilePageModule {}
