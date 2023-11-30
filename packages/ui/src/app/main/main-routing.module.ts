import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ResultAnalysisComponent } from './result-analysis/result-analysis.component';
import { MainComponent } from './main.component';
import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'meet/:profile/:id',
        component: VideoCallComponent,
      },
      {
        path: 'result-analysis',
        component: ResultAnalysisComponent,
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
