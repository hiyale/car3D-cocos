import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoadPoints')
export class RoadPoints extends Component {
    @property(
        {
            type:Node
        }
    )
    nextStation:Node = null;

    
}
