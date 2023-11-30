import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { MediaService } from "src/app/services/device/media.service";

@Component({
  selector: "app-setup-screen",
  templateUrl: "./setup-screen.component.html",
  styleUrls: ["./setup-screen.component.scss"],
})
export class SetupScreenComponent {
  constructor(private media: MediaService, private router: Router) {}
  videoTracks: MediaStreamTrack[] = [];
  audioTracks: MediaStreamTrack[] = [];
  stream: MediaStream | undefined;

  selectedVideoTrack: string | undefined;
  selectedAudioTrack: string | undefined;

  @ViewChild("videoArea")
  video?: ElementRef<HTMLVideoElement>;

  @Output()
  joinMeeting = new EventEmitter<boolean>();

  ngOnInit() {
    this.media.load().then(() => {
      this.videoTracks = this.media.getVideoInputDevices();
      this.audioTracks = this.media.getAudioInputDevices();
      this.selectedVideoTrack = this.videoTracks[0]?.getSettings().deviceId;
      this.selectedAudioTrack = this.audioTracks[0]?.getSettings().deviceId;
      this.micOrCameraChanged();
    });
  }

  updateSelections() {
    this.selectedAudioTrack = this.media.getSelectedAudioDevice();
    this.selectedVideoTrack = this.media.getSelectedVideoDevice();
  }

  async onSelectVideoTrack(track: MediaStreamTrack) {
    await this.micOrCameraChanged();
  }

  async onSelectAudioTrack(track: MediaStreamTrack) {
    await this.micOrCameraChanged();
  }

  async micOrCameraChanged() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const audioSource = this.selectedAudioTrack;
    const videoSource = this.selectedVideoTrack;
    const constraints = {
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.stream = stream;
    if (this.video) {
      this.video.nativeElement.srcObject = stream;
    }
    this.updateSelections();
  }

  ngOnDestroy() {
    this.stream?.getTracks().forEach((track) => {
      track.stop();
    });
    if (this.selectedAudioTrack) {
      this.media.stopAudioTrackById(this.selectedAudioTrack);
    }
    if (this.selectedVideoTrack) {
      this.media.stopVideoTrackById(this.selectedVideoTrack);
    }
  }

  join() {
    this.joinMeeting.emit(true);
  }

  cancel() {
    this.router.navigate(["/"]);
  }
}
