import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';
import { redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = []
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;
  constructor(
    private clipService: ClipService,
    private router: Router,
     private route: ActivatedRoute,
     private modal: ModalService
    ) { 
      this.sort$ = new BehaviorSubject(this.videoOrder)
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params => {
      this.videoOrder = params.sort === '2' ? params.sort : '1'
      this.sort$.next(this.videoOrder)
    }))

    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = []
      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
    
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault()
    this.activeClip = clip;
    this.modal.toggleModal('editClip')
  }

  update($event: IClip) {
   this.clips.forEach((element, index) => {
     if (element.docID === $event.docID) {
       this.clips[index].title = $event.title
     }
   })
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();
    this.clipService.deleteClip(clip)
    this.clips.forEach((e, i) => {
      if(e.docID == clip.docID) {
        this.clips.splice(i, 1)
      }
    })
  }

  async copyToClipboard($event: MouseEvent, docID: string | undefined) {
    $event.preventDefault()
    if (!docID) {
      return
    } 
      const url = `${location.origin}/clip/${docID}`

      await navigator.clipboard.writeText(url)
    
  }


}
