import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileSelectorComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSelectorComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  fileHovered = false;

  @Input()
  acceptedFormats: string[] = ['docx'];
  acceptString = '';

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  @Input()
  disabled = false;

  private _value?: FileList;
  @Input()
  set value(value: FileList | undefined) {
    this._value = value;
  }

  get value(): FileList | undefined {
    return this._value;
  }

  @Output()
  valueChange = new EventEmitter<FileList>();

  /* Control value accessor related properties */
  onChange = (value: FileList) => {};

  onTouched = () => {};

  writeValue(value: FileList | undefined | null): void {
    if (!value?.length) {
      this._value = undefined;
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
      return;
    }

    this.value = value;
  }

  registerOnChange(onChange: (value: FileList) => {}) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => {}) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    this._validateAcceptedFormats();
  }

  ngOnChanges() {
    this._validateAcceptedFormats();
    this.acceptString = this.acceptedFormats
      .map(format => `.${format}`)
      .join(',');
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileHovered = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileHovered = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileHovered = false;
    if (event.dataTransfer?.files) {
      this.dropped(event.dataTransfer.files);
    }
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files?.length) {
      this.dropped(files);
    }
  }

  dropped(files: FileList) {
    if (!this.validate(files)) {
      return;
    }
    this.writeValue(files);
    this.onChange(files);
    this.valueChange.emit(files);
  }

  validate(file: FileList) {
    if (!file.length) {
      return false;
    }
    for (let i = 0; i < file.length; i++) {
      const extension = file[i].name.split('.').pop();
      if (!extension || !this.acceptedFormats.includes(extension)) {
        return false;
      }
    }
    return true;
  }

  private _validateAcceptedFormats() {
    if (!this.acceptedFormats.length) {
      throw Error('Accepted file types are required');
    }
  }
}
