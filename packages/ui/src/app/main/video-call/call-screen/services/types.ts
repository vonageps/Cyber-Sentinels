export enum TrulienceEventType {
  connected,
  disconnected,
  error,
}
export interface TrulienceEvent {
  event: TrulienceEventType;
  data: TrulienceEventType;
}
