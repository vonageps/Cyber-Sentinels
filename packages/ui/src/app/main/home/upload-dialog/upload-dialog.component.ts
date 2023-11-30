import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Profile } from "../../../types";
import { ColorsService, InitialsService } from "src/app/services";
import { CvAnalyserService } from "../../../services/api/ms/cv-analyser.service";
import {
  catchError,
  interval,
  map,
  of,
  scheduled,
  switchMap,
  take,
  tap,
  timeout,
  timer,
} from "rxjs";
import { VideoMsService } from "../../../services/api/ms/video-ms.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-upload-dialog",
  templateUrl: "./upload-dialog.component.html",
  styleUrls: ["./upload-dialog.component.scss"],
})
export class UploadDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public profile: Profile,
    public colors: ColorsService,
    public initials: InitialsService,
    private cvAnalyser: CvAnalyserService,
    private videoMs: VideoMsService,
    private router: Router
  ) {}

  file: File | null = null;
  isEligible: boolean | undefined;
  processing = false;
  meetId: string | undefined;
  timeLeft = 0;
  waitFor = 5;
  fileChange(event: FileList) {
    if (event.length) {
      this.file = event.item(0);
    }
  }

  uploadCV() {
    this.processing = true;
    if (!this.file) {
      return;
    }
    this.cvAnalyser
      .analyseCv(this.file, this.profile)
      .pipe(
        switchMap((res) => {
          if (res.eligible) {
            return this.videoMs.generateMeetingId().pipe(
              map((meetingId) => {
                this.meetId = meetingId;
                return true;
              })
            );
          }
          return of(false);
        }),
        catchError((err) => {
          return of(false);
        })
      )
      .subscribe((res) => {
        this.isEligible = res;
        this.processing = false;
        if (this.isEligible) {
          timer(0, 1000)
            .pipe(take(this.waitFor))
            .subscribe((time) => {
              this.timeLeft = this.waitFor - time - 1;
              if (this.timeLeft === 0) {
                this.router.navigate([
                  "main",
                  "meet",
                  this.profile.id,
                  this.meetId,
                ]);
              }
            });
        }
      });
  }
}
