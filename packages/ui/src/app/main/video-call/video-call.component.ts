import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MediaService } from "src/app/services/device/media.service";

@Component({
  selector: "app-video-call",
  templateUrl: "./video-call.component.html",
  styleUrls: ["./video-call.component.scss"],
})
export class VideoCallComponent {
  joined = false;
}
