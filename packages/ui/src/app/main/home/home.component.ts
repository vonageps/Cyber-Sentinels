import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UploadDialogComponent } from "./upload-dialog/upload-dialog.component";
import { Profile } from "../../types";
import { ColorsService, InitialsService } from "src/app/services";
import { JDS } from "../../constants";
import { ProfilesService } from "src/app/services/api/ms/profiles.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  constructor(
    private dialog: MatDialog,
    public colors: ColorsService,
    public initials: InitialsService,
    private profileSvc: ProfilesService
  ) {}

  dialogRef?: MatDialogRef<UploadDialogComponent>;
  profiles: Profile[] = [];

  ngOnInit(): void {
    this.profileSvc.getProfiles().subscribe((profiles) => {
      this.profiles = profiles;
    });
  }

  openUploadDialog(profile: Profile): void {
    this.dialogRef = this.dialog.open(UploadDialogComponent, {
      width: "587px",
      data: profile,
    });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }
}
