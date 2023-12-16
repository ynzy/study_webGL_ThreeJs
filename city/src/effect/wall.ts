import * as THREE from "three";
import { color } from "@/config";
import { Cylinder, type IOptions } from "./cylinder";

/**
 * 扩散墙
 */
export class Wall {
  scene: any;
  time: any;
  config: IOptions;
  constructor(scene: any, time: any) {
    this.scene = scene;
    this.time = time;

    this.config = {
      radius: 50,
      height: 50,
      open: true,
      color: color.wall,
      opacity: 0.6,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      speed: 0.6,
    };

    new Cylinder(scene, time).createCylinder(this.config);
  }
}
