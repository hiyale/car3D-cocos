import { _decorator, Component, Node, find, Vec3, profiler, director } from 'cc';
import { Car } from './Car';
import { TabControl } from './UIManager/uiControl';
const { ccclass, property } = _decorator;

@ccclass('MidPoint')
export class MidPoint extends Component {

    private carNode: Node = null;
    private timerNode: Node = null;
    private curTime:number = 0;
    private startPos:Vec3 = null;
    private avgSpeed:number = 0;
    private frameRate:number = 0;

    @property
    public positionSecond:number = 0;

    start(){
        this.carNode = find("CarManager");
        //通过结构找到timer的节点，
        this.timerNode = find("Canvas/GameUI/centerUI");
        //找到车辆起始点
        this.startPos = this.carNode.getComponent(Car).startPos.position;
        this.avgSpeed = this.carNode.getComponent(Car)._maxSpeed;
    }
   
    update(dt:number){
        this.frameRate = 1 / dt;
        //console.log(director.getTotalFrames() / dt);
        if (this.curTime != this.timerNode.getComponent(TabControl).runingTime){
            this.curTime = this.timerNode.getComponent(TabControl).runingTime;
            this.updatePos();
        }
    }

    updatePos(){
        const difftime:number = this.positionSecond - this.curTime;
        if (difftime > 1){
            const carSpeed:number = this.carNode.getComponent(Car).speed > 0.6 ? 
            this.carNode.getComponent(Car).speed : 0.6;
            const posz:number = this.carNode.position.z + carSpeed * this.frameRate * difftime;
            this.node.setWorldPosition(new Vec3(this.node.position.x, this.node.position.y, posz));
            if (this.node.name.toLowerCase().includes("finish")){
                console.log(this.positionSecond + "         " + this.curTime);
            }
        }
    }
}
