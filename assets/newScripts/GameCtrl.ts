import { _decorator, Component, Node, SystemEventType, Vec2, LabelComponent, CanvasComponent } from 'cc';
import { Car } from './Car';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {

    private _touchMoveXY: Vec2 = null;
    @property(
        {
            type: Car
        }
    )
    mainCar: Car = null

    public score: number = 0;

   

    start() {
        this.mainCar.setCamera()
        // this.scheduleOnce(() => {
        //     this.mainCar.controlMove()
        // }, 1)
        this.node.on(Node.EventType.TOUCH_START, this._touchStart, this)
        this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this)      //触屏事件




    }

    update() {
        
    }

    private _touchStart(touch: Touch) {
        this._touchMoveXY = touch.getLocation();
        // this.mainCar.controlMove()
    }
    private _touchEnd(touch: Touch) {
        const endXY = touch.getLocation()
        // this.mainCar.controlMove(false)

        if (endXY.x - this._touchMoveXY.x < 0) {
            console.log('左滑', this.mainCar.node.worldPosition.x)
            if (this.mainCar.node.worldPosition.x < -2.784) {
                this.mainCar.setMoveType('center')
                console.log('回到中间')
            } else {
                this.mainCar.setMoveType('left')
                console.log('左边行驶')
            }


            // if (this.mainCar.node.worldPosition.x > 0) {
            //     this.mainCar.setMoveType('center')
            // } else {
            //     this.mainCar.setMoveType('left')
            // }


        } else if (endXY.x - this._touchMoveXY.x > 0) {

            console.log('右滑', endXY.x, this._touchMoveXY.x)
            // this.touchType = 'right'
            // this.mainCar.setMoveType('right')
            if (this.mainCar.node.worldPosition.x > -2.784) {
                this.mainCar.setMoveType('center')
            } else {
                this.mainCar.setMoveType('right')
            }
        }
    }
}
