import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AnyObject} from '@arc/core/api';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {AngularTranslationServiceStub} from 'src/testing/translation-service-stub';
import {BizbookFileSelectorModule} from '../file-selector.module';
import {FileSelectorComponent} from './file-selector.component';

describe('FileSelectorComponent', () => {
  let component: FileSelectorComponent;
  let fixture: ComponentFixture<FileSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileSelectorComponent],
      imports: [BizbookFileSelectorModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: TranslateService,
          useValue: new AngularTranslationServiceStub(),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSelectorComponent);
    component = fixture.componentInstance;
    component.acceptedFormats = ['csv'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw error if accepted file types are not provided', () => {
    component.acceptedFormats = [];
    try {
      component.ngOnChanges();
    } catch (e) {
      expect((e as AnyObject)['message']).toBe(
        'Accepted file types are required',
      );
    }
  });

  it('should not accept invalid file type on drop', () => {
    const file = new File([''], 'test.jpeg', {type: 'image/jpeg'});
    const event = {
      dataTransfer: {
        files: [file],
      },
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as DragEvent;
    component.onDrop(event);
    expect(component.value).toBe(undefined);
  });

  it('should accept valid file type on drop', () => {
    const file = new File([''], 'test.csv', {type: 'text/csv'});
    const fileList = [file] as unknown as FileList;
    const event = {
      dataTransfer: {
        files: fileList,
      },
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as DragEvent;
    component.onDrop(event);
    expect(component.value).toEqual(fileList);
  });
});
