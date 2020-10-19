import { _decorator, Component, Node, BoxColliderComponent, Vec3, loader, Prefab, instantiate, find, random } from 'cc';
import { Car } from './Car';
import { Constants } from './Other/constants';
const { ccclass, property } = _decorator;

@ccclass('ItemsMananger')
export class ItemsMananger extends Component {


    // addSpeedCoin: Node[] = []

    @property({
        type: Node
    })
    private carNode: Node = null;

    onLoad() {
        //设定距离区间的普通金币数量，第三个参数是从其实点距离，终点距离是第四个参数
        //多次运行是因为提高后期游戏出现几率，后面同理
        this.initItems("normalCoin", 25, 500);
        this.initItems("normalCoin", 10, 700);
        this.initItems("normalCoin", 10, 1850);
        //设定距离区间的加速金币数量，第三个参数是从其实点距离，终点距离是第四个参数
        this.initItems("addSpeedCoin", 10, 500);
        this.initItems("addSpeedCoin", 7, 700);
        this.initItems("addSpeedCoin", 5, 1850);
        //设定距离区间的裂隙数量，第三个参数是从其实点距离，终点距离是第四个参数
        this.initItems("Crack", 15, 500);
        this.initItems("Crack", 8, 700);
        this.initItems("Crack", 8, 1850);

        this.initRoadItems("Tree1", 20, 700, 3250);
        this.initRoadItems("Tree2", 20, 700, 3250);
        this.initRoadItems("Tree3", 15);
        this.initRoadItems("Tree1", 15);
        this.initRoadItems("Tree2", 15);
        //第三关以后多种树，哈哈哈
        this.initRoadItems("Tree1", 40, 1850);
        this.initRoadItems("Tree2", 40, 1850);
        this.initRoadItems("Tree3", 40, 1850);

        this.initRoadItems("Cactus", 150, 100,1850);
        
        this.initRoadItems("Rock1", 200, 100, 1850);
        this.initRoadItems("Montain", 20, 700, 3250,180,-22,14,5,5,0.004,0.0005);
    }

    private initRoadItems(itemName:string, itemNum:number, startPosZ:number = 50, endPosZ:number = null,
        randomRotate:number = 180, left:number = -15, right:number = 11, randomLeft:number = 9, 
        randomRight:number = 9, maxSize:number = 0.015, minSize:number = 0.003)
        {
        const car = this.carNode.getComponent(Car);
        const initItemStartZ = car.startPos.position.z + startPosZ;
        if (endPosZ == null){
            endPosZ = car.EndPos.position.z + 250;
        }
        const itemDiffZ = Math.floor((endPosZ - initItemStartZ) / itemNum);
        for (var i = 0; i < itemNum; i++) {
            const numX: number = Math.floor(Math.random() * 2);
            let itemX: number = 0;
            switch (numX) {
                case 0:
                    itemX = left + randomLeft / 2 - Math.random() * randomLeft;
                    break;
                case 1:
                    itemX = right + randomRight / 2 - Math.random() * randomRight;
                    break;
                default:
                    break;
            }
            if (itemName.indexOf("Montain") != -1){
                console.log(itemX);
            }
            
            const itemY: number = 0;
            let itemZ = initItemStartZ + i * itemDiffZ + ((Math.random() - 0.5) * itemDiffZ);
            const itemPos: Vec3 = new Vec3(itemX, itemY, itemZ);
            loader.loadRes("prefabs/" + itemName, Prefab, (err: any, prefab: Prefab)=>{
                if (err){
                    console.warn(err);
                    return;
                }
                const fab = instantiate(prefab);
                fab.position = itemPos;
                fab.parent = find("ItemsManager");
                fab.eulerAngles = new Vec3(0,Math.random() * 360,0);
                let randSize:number = Math.random() * (maxSize - minSize) + minSize;
                fab.scale = new Vec3(randSize,randSize,randSize);
            })
        }
        
    }

    private initItems(itemName:string, itemNum:number, startPosZ:number = 100, endPosZ:number = null, size:number = 0.01){
        const car = this.carNode.getComponent(Car);
        if (endPosZ == null){
            endPosZ = car.EndPos.position.z + 250;
        }
        const initConinStartZ = car.startPos.position.z + startPosZ;
        const coinDiffZ = Math.floor((endPosZ - initConinStartZ) / itemNum);
        for (var i = 0; i < itemNum; i++) {
            const numX: number = Math.floor(Math.random() * 3);
            let coinX: number = 0;
            switch (numX) {
                case 0:
                    coinX = -5.727;
                    break;
                case 1:
                    coinX = -2.6;
                    break;
                case 2:
                    coinX = 0.638;
                    break;
                default:
                    break;
            }
            const coinY: number = 0;
            let coinZ = initConinStartZ + i * coinDiffZ + ((Math.random() - 0.5) * coinDiffZ);
            const coinPos: Vec3 = new Vec3(coinX, coinY, coinZ);
            loader.loadRes("prefabs/" + itemName, Prefab, (err: any, prefab: Prefab)=>{
                if (err){
                    console.warn(err);
                    return;
                }
                const fab = instantiate(prefab);
                fab.position = coinPos;
                fab.parent = find("ItemsManager");
                fab.eulerAngles = new Vec3(0,180,0);
                fab.scale = new Vec3(size, size, size);
                this.initColliderObjects(fab, Constants.ColliderGroup.NORMALCOIN, Constants.ColliderGroup.CAR);
            })
        }
    }

    private initColliderObjects(obj: Node, group: number, mask: number) {
        const collider = obj.getComponent(BoxColliderComponent);
        if(collider){
            collider.setGroup(group);
            collider.setMask(mask);
        }
        //console.log(collider);
    }


    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
