import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('SelfRotor')
@executeInEditMode // not always a good idea
export class SelfRotor extends Component {

    @property
    _euler = new Vec3();
    @property
    localSpace = true;

    _quat = new Quat();

    @property
    set euler (val: Vec3) {
        Vec3.copy(this._euler, val);
        Quat.fromEuler(this._quat, this.euler.x, this.euler.y, this.euler.z);
    }
    get euler () {
        return this._euler;
    }

    onLoad () {
        this.euler = this._euler;
    }

    update (dt: number) {
        this.node.rotate(this._quat, this.localSpace ? Node.NodeSpace.LOCAL : Node.NodeSpace.WORLD);
    }
}
