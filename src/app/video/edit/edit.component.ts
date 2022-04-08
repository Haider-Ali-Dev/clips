import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnChanges } from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { Output, EventEmitter } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = "Please wait! Updating clip."
  @Output() update = new EventEmitter();
  clipID = new FormControl('', [])
  videoTitle = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ])

  formGroup = new FormGroup({
    videoTitle: this.videoTitle,
    id: this.clipID
  })

  constructor(private modal: ModalService,
    private clipService: ClipService) { }

  ngOnChanges(): void {
      if (!this.activeClip) {
        return
      }
      this.inSubmission = false;
      this.showAlert = false;
      this.clipID.setValue(this.activeClip.docID)
      this.videoTitle.setValue(this.activeClip.title)

  }
  ngOnInit(): void {
    this.modal.register("editClip")

  }

  ngOnDestroy(): void {
      this.modal.unregister("editClip")
  }

  async submit() {
    if (!this.activeClip) {
      return
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = "Please wait! Updating clip.";

    try {
      await this.clipService.updateClip(this.clipID.value, this.videoTitle.value)

    } catch(e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = "Something went wrong. Try again later";
      return
    }

    this.activeClip.title  = this.videoTitle.value;
    this.update.emit(this.activeClip)

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = "Success!";


  }



}
