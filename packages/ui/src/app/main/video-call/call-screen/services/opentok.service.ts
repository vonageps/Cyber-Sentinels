import { ElementRef, Injectable } from "@angular/core";
import { initPublisher, initSession } from "@opentok/client";
import { Subject } from "rxjs";
import { MediaService } from "src/app/services/device/media.service";
import { OTEvent, SessionEvents } from "src/app/types";
import { environment } from "src/environments/environment";

@Injectable()
export class OpentokService {
  private _publishing: boolean = false;
  private _stream = new Subject<OTEvent>();
  private _session: OT.Session | undefined;
  private _publisher: OT.Publisher | undefined;
  constructor(private media: MediaService) {}
  initSession(sessionId: string, token: string, publisherElement: ElementRef) {
    if (this._session) {
      return this._stream.asObservable();
    }
    const session = initSession(environment.api.opentok.key, sessionId);
    session.connect(token, (err) => {
      if (err) {
        this._stream.error(err);
      } else {
        this._stream.next({
          event: SessionEvents.connected,
          data: session,
        });
        this.publish(session, publisherElement);
        session.on("streamCreated", (event) => {
          this._stream.next({
            event: SessionEvents.streamcreated,
            data: event.stream,
          });
        });
        session.on("streamDestroyed", (event) => {
          this._stream.next({
            event: SessionEvents.streamdestroyed,
            data: event.stream,
          });
        });
      }
    });
    return this._stream.asObservable();
  }

  destroy() {
    if (this._session) {
      this._publisher?.destroy();
      this._session.disconnect();
    }
  }

  receiveCaptions() {
    if (!this._session || !this._publisher?.stream) {
      return;
    }

    const captionOnlySub = this._session.subscribe(
      this._publisher?.stream,
      document.createElement("div"),
      {
        audioVolume: 0,
      }
    );
    captionOnlySub.subscribeToCaptions(true);

    captionOnlySub.on("captionReceived", (event) => {
      console.log(event);
    });
  }

  private publish(session: OT.Session, element: ElementRef) {
    const publisher = initPublisher(element.nativeElement, {
      insertMode: "append",
      width: "100%",
      height: "100%",
      videoSource: this.media.getSelectedVideoDevice(),
      audioSource: this.media.getSelectedAudioDevice(),
      publishCaptions: true,
      publishAudio: true,
      publishVideo: true,
    });
    this._publisher = publisher;
    session.publish(publisher, (err) => {
      if (err) {
        this._stream.error(err);
      } else {
        this._stream.next({
          event: SessionEvents.published,
          data: publisher,
        });
      }
    });
  }
}
