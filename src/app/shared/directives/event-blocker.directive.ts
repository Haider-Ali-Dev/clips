import { Directive } from '@angular/core';
import { HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]'
})
export class EventBlockerDirective {
  @HostListener('dragover', ['$event'])
  @HostListener('drop', ['$event'])
  public handleEvent(event: Event) {
    event.preventDefault()
  }
}
