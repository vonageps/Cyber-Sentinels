import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/services";
import { SessionResponse } from "src/app/types";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class VideoMsService {
  constructor(private api: ApiService) {}
  generateMeetingId() {
    return this.api.post(
      `${environment.api.video}/session`,
      {},
      {
        responseType: "text",
      }
    );
  }

  getToken(meetingId: string): Observable<SessionResponse> {
    return this.api.post(
      `${environment.api.video}/session/${meetingId}/token`,
      {}
    );
  }

  generateQuiz(jobDescription: string): Observable<any> {
    return this.api.post(`${environment.api.video}/quiz`, {
      jobDescription,
    });
  }
}
