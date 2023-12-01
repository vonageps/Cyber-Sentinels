import { Injectable } from '@angular/core';
import { Subject, debounce, debounceTime, take } from 'rxjs';
import { TrulienceEvent, TrulienceEventType } from './types';
import { environment } from 'src/environments/environment';
import * as hark from 'hark';
declare const Trulience: any; //nosonar

@Injectable({
  providedIn: 'root',
})
export class TrulienceService {
  trulience: any = null;
  avatarId = environment.trulienceAgentId;
  loopRequestId?: number;
  speaking$ = new Subject<TrulienceEvent>();
  listenSubject = new Subject<any>();
  constructor() {}

  listen() {
    return this.speaking$.asObservable();
  }

  listenForAns() {
    return this.listenSubject.asObservable().pipe(debounceTime(2000), take(1));
  }

  connect() {
    const subject = new Subject<TrulienceEvent>();
    const authenticated = () => {
      // autoconnect
      this.trulience.connectGateway();
    };
    const connected = () => {
      console.log('connected');
      subject.next({
        event: TrulienceEventType.connected,
        data: this.trulience,
      });
      this.setupAudioDetector(subject);
    };

    const disconnected = () => {
      subject.next({
        event: TrulienceEventType.disconnected,
        data: this.trulience,
      });
    };

    const handleMessage = (e: any) => {
      // do nothing as of now
      console.log('message', e);
      if (e.type === 'USER' && e.username !== 'Sally') {
        console.log(e.messageArray[0].message);
        this.listenSubject.next({
          data: e.messageArray[0].message,
        });
      }
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
      remoteVideo: 'myvideo',
    };

    this.trulience = Trulience.Builder()
      .setAvatarId(this.avatarId) // Setting as String as Long values are truncated in JavaScript
      .setLanguagePreference('en-US')
      .setUserName('Guest')
      .enableAvatar(true) // false for chat only, true for chat and video avatar
      .setAuthCallbacks(authEvents)
      .setWebSocketCallbacks(wsEvents)
      .setMediaCallbacks(mediaEvents)
      .registerVideoElements(videoElements)
      .setRetry(false)
      .build();
    this.trulience.authenticate();
    window.onunload = () => {
      this.trulience.disconnectGateway();
    };
    return subject.asObservable();
  }

  setupAudioDetector(subject: Subject<TrulienceEvent>) {
    this.trulience._rtc.peerConnection.getStats().then((stats: any) => {
      console.log('a');
    });
    const seech = hark(this.trulience._rtc.rvstream, {});
    seech.on('speaking', () => {
      subject.next({
        event: TrulienceEventType.speakingstarted,
        data: this.trulience,
      });
      this.speaking$.next({
        event: TrulienceEventType.speakingstarted,
        data: this.trulience,
      });
    });
    seech.on('stopped_speaking', () => {
      subject.next({
        event: TrulienceEventType.speakingstopped,
        data: this.trulience,
      });
      this.speaking$.next({
        event: TrulienceEventType.speakingstopped,
        data: this.trulience,
      });
    });
  }

  destroy() {
    this.trulience.disconnectGateway();
  }

  speak(message: string) {
    this.trulience.sendMessageToVPS(message);
  }
}
