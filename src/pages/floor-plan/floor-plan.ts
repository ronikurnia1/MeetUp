import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from "jquery";
import "./hammer.min";
import "./jquery.mousewheel";
import "./mapplic";

@Component({
  selector: 'page-floor-plan',
  templateUrl: 'floor-plan.html'
})
export class FloorPlanPage {

  @ViewChild("floorPlan")
  private floorPlan: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad', $(this.floorPlan.nativeElement).html());
    let map = $(this.floorPlan.nativeElement).mapplic({
      source: 'assets/floor-plan/mall.json',	// Using mall.json file as map data
      sidebar: true, 			// Enable sidebar
      minimap: false, 			// Enable minimap
      markers: false, 		// Disable markers
      fillcolor: false, 		// Disable default fill color
      fullscreen: true, 		// Enable fullscreen 
      maxscale: 3 			// Setting maxscale to 3      
    });


    // $('.usage').click(function (e) {
    //   e.preventDefault();
    //   $('.editor-window').slideToggle(200);
    // });

    // $(document).on('mousemove', '.mapplic-layer', function (e) {
    //   var map = $('.mapplic-map');
    //   let x = ((e.pageX - map.offset().left) / map.width()).toString();
    //   let y = ((e.pageY - map.offset().top) / map.height()).toString();
    //   $('.mapplic-coordinates-x').text(parseFloat(x).toFixed(4));
    //   $('.mapplic-coordinates-y').text(parseFloat(y).toFixed(4));
    // });

    // $('.editor-window .window-mockup').click(function () {
    //   $('.editor-window').slideUp(200);
    // });
  }


}
