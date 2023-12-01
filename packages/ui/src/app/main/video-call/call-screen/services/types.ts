export enum TrulienceEventType {
  connected,
  disconnected,
  error,
  speakingstopped,
  speakingstarted,
}
export interface TrulienceEvent {
  event: TrulienceEventType;
  data: TrulienceEventType;
}

