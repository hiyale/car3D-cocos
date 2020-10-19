import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IconController')
export class IconController extends Component {
    @property({
        type: Node,
        displayOrder: 1
    })
    public iconLift:Node = null;

    @property({
        type: Node,
        displayOrder: 2
    })
    public iconSmooth:Node = null;

    @property({
        type: Node,
        displayOrder: 3
    })
    public iconReplenish:Node = null;

    start(){
        this.showIcon("lift");
    }

    showIcon(iconName:string){
        this.iconLift.active = false;
        this.iconSmooth.active = false;
        this.iconReplenish.active = false;
        switch(iconName){
            case "lift":
                this.iconLift.active = true;
                break;
            case "smooth":
                this.iconSmooth.active = true;
                break;
            case "replenish":
                this.iconReplenish.active = true;
                break;
        }
    }
}
