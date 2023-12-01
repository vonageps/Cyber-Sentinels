import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  filter,
  forkJoin,
  map,
  of,
  pairwise,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { VideoMsService } from 'src/app/services/api/ms/video-ms.service';
import { OpentokService } from './services/opentok.service';
import { Question, Quiz, SessionEvents } from 'src/app/types';
import { TrulienceService } from './services/trulience.service';
import { ProfilesService } from 'src/app/services/api/ms/profiles.service';
import { TrulienceEventType } from './services/types';
import { InterviewService } from './services/interview.service';

@Component({
  selector: 'app-call-screen',
  templateUrl: './call-screen.component.html',
  styleUrls: ['./call-screen.component.scss'],
  providers: [OpentokService, InterviewService],
})
export class CallScreenComponent implements AfterViewInit {
  constructor(
    private videoMs: VideoMsService,
    private opentok: OpentokService,
    private activeRoute: ActivatedRoute,
    private trulience: TrulienceService,
    private profileService: ProfilesService,
    private interviewService: InterviewService,
    private router: Router
  ) {}
  error?: string;
  loading = true;
  processingAnswer = false;
  sessionId?: string;
  token?: string;
  quiz?: Quiz;
  answer?: string;
  currentQuestion: Question | null = null;
  startQuestiong = false;
  doneQuestiong = false;

  mute = true;

  @ViewChild('interviewerDiv')
  interviewerDiv!: ElementRef;

  @ViewChild('candidateDiv')
  candidateDiv!: ElementRef;

  @ViewChild('trulienceDiv')
  trulienceDiv!: ElementRef;

  ngAfterViewInit() {
    this.activeRoute.paramMap
      .pipe(
        switchMap((params) => {
          const meetingId = params.get('id');
          const profileId = params.get('profile');
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
            this.error = 'Invalid meeting id';
            console.log(this.error);
            return of([null, null]);
          }
        }),
        catchError((err) => {
          this.error = 'Invalid meeting id';
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
              this.trulience
                .listen()
                .pipe(debounceTime(2000))
                .subscribe((v) => {
                  if (v.event === TrulienceEventType.speakingstopped) {
                    this.mute = false;
                  } else {
                    this.mute = true;
                  }
                  if (!this.mute && this.startQuestiong) {
                    this.continueInterview();
                    this.startQuestiong = false;
                    this.mute = true;
                  }
                  if (!this.mute && this.doneQuestiong) {
                    this.gotoResults();
                  }
                  if (!this.mute && this.currentQuestion) {
                    const sub = this.trulience.listenForAns().subscribe((v) => {
                      this.answer = v.data;
                      this.processAnswer();
                      sub.unsubscribe();
                    });
                  }
                });
              this.welcome();
            }
          });
        } else {
          this.error = !res ? 'Invalid meeting id' : 'Invalid profile id';
          console.log(this.error);
        }
      });
  }

  welcome() {
    this.loading = false;
    const welcome = this.interviewService.welcome();
    if (welcome) {
      this.trulience.speak(welcome);
      this.startQuestiong = true;
    }
  }

  continueInterview() {
    const next = this.interviewService.next();
    if (next) {
      this.currentQuestion = next;
      this.trulience.speak([next.question, ...next.options].join('. '));
    } else {
      this.currentQuestion = null;
      this.trulience.speak(this.interviewService.done());
      this.doneQuestiong = true;
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
    this.trulience.destroy();
  }

  processAnswer() {
    this.processingAnswer = true;
    if (this.answer && this.currentQuestion) {
      this.videoMs
        .checkAnswer(
          this.currentQuestion.question,
          this.currentQuestion.answer,
          this.currentQuestion.options,
          this.answer
        )
        .subscribe((v) => {
          this.answer = '';
          this.mute = true;
          this.processingAnswer = false;
          if (this.currentQuestion) {
            this.interviewService.answer(this.currentQuestion, v, this.answer);
          }
          this.currentQuestion = null;
          this.continueInterview();
        });
    }
  }

  gotoResults() {
    console.log(this.interviewService.result());
    this.router.navigate(['main', 'result-analysis']);
  }
}
