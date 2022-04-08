import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last } from 'rxjs/operators'
import  { AngularFireAuth } from '@angular/fire/compat/auth'
import firebase from 'firebase/compat/app';
import { switchMap } from 'rxjs/operators';
import { ClipService } from 'src/app/services/clip.service';
import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  isDragOver  = false;
  formVisbility = false;
  file: File | null = null;
  showAlert = false
  alertColor = 'blue'
  alertMsg = "Please wait! Your clip is being uploaded."
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null
  task?: AngularFireUploadTask;
  videoTitle = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ])

  formGroup = new FormGroup({
    videoTitle: this.videoTitle
  })



  constructor(
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
     )
     { 
      auth.user.subscribe(user => this.user = user)
      this.ffmpegService.init()
    }

  
    ngOnDestroy(): void {
      this.task?.cancel()
    }

  

  async storeFile($event: Event) {
    this.isDragOver = false;
    this.file = ($event as DragEvent).dataTransfer ? 
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null : 
    ($event.target as HTMLInputElement).files?.item(0) ?? null;
    
    if (!this.file || this.file.type !== "video/mp4") {
      return 
    }

    await this.ffmpegService.getScreenshots(this.file)

    this.videoTitle.setValue(
      this.file.name.replace(
        /\.[^/.]+$/, ""
      )
    )
    this.formVisbility = true;
  }

  uploadFile() {
    this.formGroup.disable()
    this.showAlert = true;
    this.alertColor = 'blue'
    this.alertMsg = "Please wait! Your clip is being uploaded."
    this.inSubmission = true;
    this.showPercentage = true;

    let clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

   this.task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath);
    this.task.percentageChanges().subscribe(progess => {
      this.percentage = progess as number / 100;
    })

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.videoTitle.value,
          fileName: `${clipFileName}.mp4`,
          url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        const clipDocRef = await this.clipsService.createClip(clip)


        console.log(clip)

        this.alertColor = 'green';
        this.alertMsg = "Success! Your clip is now ready to share with the world."
        this.showPercentage = false;

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        })
      },
      error: (error) => {
        this.formGroup.enable()
        this.alertColor = 'red'
        this.alertMsg = 'Upload failed! Please try again later'
        this.inSubmission = true
        this.showPercentage = false
        console.log(error)
      }
    })
  
  }

}
