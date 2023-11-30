import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError, forkJoin, map, of, switchMap } from "rxjs";
import { VideoMsService } from "src/app/services/api/ms/video-ms.service";
import { OpentokService } from "./services/opentok.service";
import { Quiz, SessionEvents } from "src/app/types";
import { TrulienceService } from "./services/trulience.service";
import { ProfilesService } from "src/app/services/api/ms/profiles.service";
import { TrulienceEventType } from "./services/types";
import { InterviewService } from "./services/interview.service";

@Component({
  selector: "app-call-screen",
  templateUrl: "./call-screen.component.html",
  styleUrls: ["./call-screen.component.scss"],
  providers: [OpentokService, InterviewService],
})
export class CallScreenComponent implements AfterViewInit {
  constructor(
    private videoMs: VideoMsService,
    private opentok: OpentokService,
    private activeRoute: ActivatedRoute,
    private trulience: TrulienceService,
    private profileService: ProfilesService,
    private interviewService: InterviewService
  ) {}
  error?: string;
  sessionId?: string;
  token?: string;
  quiz?: Quiz;

  mute = true;

  @ViewChild("interviewerDiv")
  interviewerDiv!: ElementRef;

  @ViewChild("candidateDiv")
  candidateDiv!: ElementRef;

  ngAfterViewInit() {
    this.activeRoute.paramMap
      .pipe(
        switchMap((params) => {
          const meetingId = params.get("id");
          const profileId = params.get("profile");
          if (meetingId && profileId) {
            return forkJoin([
              this.videoMs.getToken(meetingId),
              this.profileService.getProfileById(profileId).pipe(
                switchMap((profile) => {
                  if (profile) {
                    return this.videoMs.generateQuiz(profile?.jd).pipe(
                      map((quiz) => {
                        this.quiz = quiz;
                        this.interviewService.feedQuiz(quiz);
                        return profile;
                      })
                    );
                  }
                  return of(null);
                })
              ),
            ]);
          } else {
            this.error = "Invalid meeting id";
            console.log(this.error);
            return of([null, null]);
          }
        }),
        catchError((err) => {
          this.error = "Invalid meeting id";
          console.log(this.error);
          return of([null, null]);
        })
      )
      .subscribe(([res, profile]) => {
        if (res && profile) {
          this.sessionId = res.sessionId;
          this.token = res.token;
          this.initPublisher(res.sessionId, res.token);
          this.trulience.connect().subscribe((v) => {
            if (v.event === TrulienceEventType.connected) {
              this.initInterview();
            }
          });
        } else {
          this.error = !res ? "Invalid meeting id" : "Invalid profile id";
          console.log(this.error);
        }
      });
  }

  initInterview() {
    const message = this.interviewService.next();
    if (message) {
      this.trulience.speak(message);
    }
  }

  handleMessage() {
    this.mute = true;
  }

  initPublisher(sessionId: string, token: string) {
    if (this.interviewerDiv) {
      this.opentok
        .initSession(sessionId, token, this.candidateDiv)
        .subscribe((v) => {
          if (v.event === SessionEvents.published) {
            this.opentok.receiveCaptions();
          }
        });
    }
  }

  ngOnDestroy() {
    this.opentok.destroy();
    this.interviewService.reset();
  }
}
