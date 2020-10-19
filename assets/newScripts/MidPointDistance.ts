import { _decorator, Component, Node, Vec3, find } from 'cc';
import { Car } from './Car';
import { IconController } from './UIManager/IconController';
const { ccclass, property } = _decorator;

@ccclass('MidPointDistance')
export class MidPointDistance extends Component {
    @property({
        type: Node,
        displayOrder: 1
    })
    liftPoint = null;

    @property({
        type: Node,
        displayOrder: 2
    })
    smoothPoint = null;

    @property({
        type: Node,
        displayOrder: 3
    })
    replenishPoint = null;

    @property({
        type: Node,
        displayOrder: 4
    })
    finishPoint = null;

    @property({
        type: Node,
        displayOrder: 5
    })
    startPoint = null;

    @property({
        type: Node,
        displayOrder: 6
    })
    endPoint = null;

    @property({
        displayOrder: 7
    })
    firstPointDistance:number = 0;
    
    @property({
        type: Node,
        displayOrder: 8
    })
    carManager:Node = null;

    private totalRoadLength:number = 0;

    start(){
        this.totalRoadLength = this.endPoint.position.z - this.startPoint.position.z;
        
        const disZ:number = (this.totalRoadLength - this.firstPointDistance)/3;
        const liftZ:number = this.startPoint.position.z + this.firstPointDistance;

        this.liftPoint.position = new Vec3(this.liftPoint.position.x, this.liftPoint.position.y,liftZ);
        //console.log(this.liftPoint.position.z);
        this.smoothPoint.position = new Vec3(this.smoothPoint.position.x, this.smoothPoint.position.y,liftZ + disZ);
        //console.log(this.smoothPoint.position.z);
        this.replenishPoint.position = new Vec3(this.replenishPoint.position.x, this.replenishPoint.position.y, liftZ + 2 * disZ);
        //console.log(this.replenishPoint.position.z);
        this.endPoint.position = new Vec3(this.endPoint.position.x, this.endPoint.position.y, liftZ + 3 * disZ);
        //console.log(this.endPoint.position.z);
    }

    update(){
        const icons:IconController[] = find("ItemsManager").getComponentsInChildren(IconController);
        if (this.carManager.position.z >= this.replenishPoint.position.z){
            icons.forEach(ele => {
                ele.showIcon("replenish");
            });
        }else if (this.carManager.position.z >= this.smoothPoint.position.z){
            icons.forEach(ele => {
                ele.showIcon("smooth");
            });
        }
    }
}
