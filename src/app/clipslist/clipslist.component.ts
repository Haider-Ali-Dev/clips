import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-clipslist',
  templateUrl: './clipslist.component.html',
  styleUrls: ['./clipslist.component.css'],
  providers: [DatePipe]
})
export class ClipslistComponent implements OnInit, OnDestroy {
  @Input() scrollable = true
  constructor(public clipService: ClipService) { 
    this.clipService.getClips()
  } 
  ngOnDestroy(): void {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll)

    }
  }

  ngOnInit(): void {
    if (this.scrollable) {
        window.addEventListener('scroll', this.handleScroll)
    }

    this.clipService.pageClips = [];
  }


  handleScroll  = () => {
    
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;
    const bottomOfWindow = Math.round(scrollTop) + innerHeight  === offsetHeight - 1;
    if(bottomOfWindow) {
      this.clipService.getClips()
    }
  }

}
