import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SharedModule } from "../shared/shared.module";
import { UploadDialogComponent } from "./home/upload-dialog/upload-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { ResultAnalysisComponent } from "./result-analysis/result-analysis.component";
import { MatRadioModule } from "@angular/material/radio";
import { VideoCallComponent } from "./video-call/video-call.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CallScreenComponent } from './video-call/call-screen/call-screen.component';
import { SetupScreenComponent } from "./video-call/setup-screen/setup-screen.component";

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    UploadDialogComponent,
    ResultAnalysisComponent,
    VideoCallComponent,
    CallScreenComponent,
    SetupScreenComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule
  ],
})
export class MainModule {}
