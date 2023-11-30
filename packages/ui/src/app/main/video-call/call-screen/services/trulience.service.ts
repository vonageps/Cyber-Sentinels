import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { TrulienceEvent, TrulienceEventType } from "./types";
import { environment } from "src/environments/environment";
declare const Trulience: any; //nosonar

@Injectable({
  providedIn: "root",
})
export class TrulienceService {
  trulience: any = null;
  avatarId = environment.trulienceAgentId;

  connect() {
    const subject = new Subject<TrulienceEvent>();
    const authenticated = () => {
      // autoconnect
      this.trulience.connectGateway();
    };
    const connected = () => {
      subject.next({
        event: TrulienceEventType.connected,
        data: this.trulience,
      });
    };

    const disconnected = () => {
      subject.next({
        event: TrulienceEventType.disconnected,
        data: this.trulience,
      });
    };

    const handleMessage = (e: any) => {
      // do nothing as of now
      console.log(e);
    };

    const authEvents = {
      onReady: authenticated,
      onFail: null,
    };

    // Trulience websocket callbacks
    const wsEvents = {
      onOpen: null,
      onConnectFail: null,
      onMessage: handleMessage,
      onWarn: null,
      onError: null,
      onClose: null,
    };

    // Trulience media event callbacks
    const mediaEvents = {
      onConnected: connected,
      onWaiting: null,
      onBusy: null,
      onConnecting: null,
      onDisconnect: disconnected,
      micStatus: null,
    };

    // id of video element to display avatar
    const videoElements = {
      remoteVideo: "myvideo",
    };

    this.trulience = Trulience.Builder()
      .setAvatarId(this.avatarId) // Setting as String as Long values are truncated in JavaScript
      .setLanguagePreference("en-US")
      .setUserName("Guest")
      .enableAvatar(true) // false for chat only, true for chat and video avatar
      .setAuthCallbacks(authEvents)
      .setWebSocketCallbacks(wsEvents)
      .setMediaCallbacks(mediaEvents)
      .setRetry(false)
      .registerVideoElements(videoElements)
      .build();
    this.trulience.authenticate();
    this.trulience.connectGateway();
    return subject.asObservable();
  }

  speak(message: string) {
    this.trulience.sendMessageToVPS(message);
  }
}
