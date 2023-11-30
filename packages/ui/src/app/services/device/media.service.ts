import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MediaService {
  private videoTracks: MediaStreamTrack[] = [];
  private audioTracks: MediaStreamTrack[] = [];
  private selectedStream?: MediaStream;
  private constraints = {
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440,
      },
    },
  };

  async load() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.audioTracks = stream.getAudioTracks();
    this.videoTracks = stream.getVideoTracks();
  }

  getAudioInputDevices() {
    return this.audioTracks;
  }

  getVideoInputDevices() {
    return this.videoTracks;
  }

  getSelectedAudioDevice() {
    return this.audioTracks.find((track) => track.enabled)?.getSettings()
      .deviceId;
  }

  getSelectedVideoDevice() {
    return this.videoTracks.find((track) => track.enabled)?.getSettings()
      .deviceId;
  }

  stopAudioTrackById(id: string) {
    this.audioTracks.find((track) => track.getSettings().deviceId === id)?.stop();
  }

  stopVideoTrackById(id: string) {
    this.videoTracks.find((track) => track.getSettings().deviceId === id)?.stop();
  }

  getVideoStream(track: MediaStreamTrack) {
    return navigator.mediaDevices.getUserMedia({
      ...this.constraints,
      video: {
        deviceId: track.getSettings().deviceId,
      },
    });
  }

  getAudioStream(track: MediaStreamTrack) {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: track.getSettings().deviceId,
      },
    });
  }

  clear() {
    this.audioTracks = [];
    this.videoTracks = [];
  }
}
