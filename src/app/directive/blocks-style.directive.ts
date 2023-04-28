import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appBlocksStyle]',
  host: {
    '(document:keyup)': 'initKeyUp($event)',
  },
  exportAs: 'blocksStyle'
})
export class BlocksStyleDirective implements OnInit, AfterViewInit {

  @Input() selector: string;
  @Input() initFirst: boolean = false;

  @Output() renderComplete = new EventEmitter();

  private items: HTMLElement[];
  private index: number = 0;
  public activeElementIndex: number = 0;

  $event: KeyboardEvent;


  constructor(private el: ElementRef) {

   }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.activeElementIndex = 0

    if (this.selector) {
      this.items = this.el.nativeElement.querySelectorAll(this.selector);

      if (this.initFirst) {
        if (this.items[0]) {
          (this.items[0] as HTMLElement).setAttribute('style', 'border: 3px solid blue');
        }
      }
    } else {
      console.error('Не передан селектор')
    }
    setTimeout(() =>{
      this.renderComplete.emit(true);
    })
  }
  initKeyUp(ev: KeyboardEvent): void {

    const prevIndex=this.index;

    if (ev.key === 'ArrowRight') {
      this.index++;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 3px solid blue');
      }
    } else if (ev.key === 'ArrowLeft') {
      this.index--;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 3px solid blue');

        // setTimeout(function () {
        //   window.scrollTo(0, 0);
        // },2);

      }
    } else if (ev.key === 'ArrowDown') {
      this.index=this.index+3;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 3px solid blue')
      }
    }
    else if (ev.key === 'ArrowUp') {
      this.index=this.index-3;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 3px solid blue')

      }
    }
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      if ( this.items[this.index] ) {  // хочу, чтобы он снимал выделение с блока, только если этот блок существует
        (this.items[prevIndex] as HTMLElement).removeAttribute('style');
      } else
        this.index = prevIndex;
    }

    this.activeElementIndex = this.index;
    this.activeElementIndex = this.index;
        this.items[this.index].scrollIntoView({behavior:'smooth',block:'center',inline: 'start'});
  }
    initStyle( index: number):void {
      this.index = index;
      this.activeElementIndex = this.index;
      if (this.items[index]){
       (this.items[index] as HTMLElement).setAttribute('style', 'border: 3px solid blue')
      }
   }

  updateItems(): void {
    this.items = this.el.nativeElement.querySelectorAll(this.selector);
  }
}
