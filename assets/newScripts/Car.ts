import { _decorator, Component, Node, Vec2, Vec3, BoxColliderComponent, ICollisionEvent, AnimationComponent, Scheduler, RigidBodyComponent, find } from 'cc';
import { GameCtrl } from './GameCtrl';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { ResourceManager } from './ResourceManager';
import { RoadPoints } from './RoadPoints';
import { TabControl } from './UIManager/uiControl';
const { ccclass, property } = _decorator;

@ccclass('Car')
export class Car extends Component {


    @property({
        displayOrder: 1
    })
    public speed = 0.1;

    @property
    minSpeed = 0.1;

    @property({
        type: Node,
        displayOrder: 2
    })
    startPos: Node = null;  //中心开始点

    @property({
        type: Node,
        displayOrder: 3
    })
    leftStartPos: Node = null   //左赛道开始点

    @property({
        type: Node,
        displayOrder: 4
    })
    rightStartPos: Node = null  //右赛道开始点

    @property({
        type: Node,
        displayOrder: 5
    })
    EndPos: Node = null;  //中心开始点

    @property({
        type: Node,
        displayOrder: 6
    })
    leftEndPos: Node = null   //左赛道开始点

    @property({
        type: Node,
        displayOrder: 7
    })
    rightEndPos: Node = null  //右赛道开始点

    @property({
        type: Node
    })
    camera: Node = null; //设置相机

    private _cameraPos = new Vec3();   //相机初始位置

    private _cameraRotate = new Vec3(); //固定相机旋转





    private _startPos = new Vec3();
    private _endPos = new Vec3();
    private _offsetPos = new Vec3();

    private _addSpeed = 0.005;

    public _maxSpeed = 1;

    private temVec = new Vec3()

    private _moveType = null;   //左、右、中间移动方式，默认为空

    private _rotateY = new Vec3();  //赛车车身旋转角度

    private _targetPostion = null

    private x = null;

    public score: number = 0;

    private _isRuning = false;  //是否游戏开始
    private _isShutCamera: boolean = false;  //是否固定住摄像机

    @property({
        type: ResourceManager
    })
    resourceManager: ResourceManager = null;


    private _isMove = true

    update(dt: number) {
        if (this._isRuning && this._isMove) {

            this.speed += this._addSpeed;
            if (this.speed > this._maxSpeed) {
                this.speed = this._maxSpeed
            }

            this._setMoveType()
            this._running();
            if (!this._isShutCamera) {
                this.setCamera(true)
            } else {

                console.log('固定摄像机')
                this.setCamera(false)
            }




        }

    }
    start() {
        this.setNode(this.startPos)
        this._cameraPos = this.camera.worldPosition;
        this._cameraRotate = this.camera.eulerAngles;
        customerListener.on(Constants.GameStatus.GAME_START, this.GameStart, this)
        // customerListener.on(Constants.GameStatus.GAME_OVER, this.GameOver, this)
    }
    public GameStart() {
        this._isRuning = true
    }
    public GameOver() {
        this._isRuning = false
        // this._isShutCamera = true
        //游戏结束时将摄像机固定住，赛车继续往前跑远
    }
    private _colliderInit() {    //碰撞初始化
        const selfcollider = this.node.getComponent(BoxColliderComponent);
        selfcollider.on('onTriggerEnter', this._TriggerCheck, this);
        selfcollider.setGroup(Constants.ColliderGroup.CAR)
        selfcollider.setMask(Constants.ColliderGroup.ADDCOIN);
        selfcollider.addMask(Constants.ColliderGroup.NORMALCOIN);
    }
    private _TriggerCheck(event: ICollisionEvent) {   //碰撞检测
        const otherCollider = event.otherCollider;
        console.log(event, otherCollider.node.name, '发生碰撞')
        if (otherCollider.node.name == 'normalCoin') {    //普通金币
            console.log(otherCollider.node.name, '普通金币')
            customerListener.dispatch(Constants.GameStatus.GET_COIN, 10)
            const anim: AnimationComponent = otherCollider.node.getComponent(AnimationComponent);
            const otherRigid = otherCollider.node.getComponent(RigidBodyComponent);
            this.resourceManager.playCoinSound();
            anim.play();
            otherRigid.applyForce(new Vec3(0, 0, 5000 * this.speed));
            this.scheduleOnce(() => {
                this.destroyCoin(otherCollider.node);
            }, 0.2);
        } else if (otherCollider.node.name == 'addSpeedCoin') {
            console.log(otherCollider.node.name, '加速金币')

            customerListener.dispatch(Constants.GameStatus.GET_COIN, 20)
            const anim: AnimationComponent = otherCollider.node.getComponent(AnimationComponent);
            const otherRigid = otherCollider.node.getComponent(RigidBodyComponent);
            this.resourceManager.playCoinSound();
            anim.play();
            otherRigid.applyForce(new Vec3(0, 0, 5000 * this.speed));
            this.scheduleOnce(() => {
                this.destroyCoin(otherCollider.node);
            }, 0.2);
            this._maxSpeed += 0.5;
        } else if (otherCollider.node.name == 'Crack') {
            console.log(otherCollider.node.name, '碰到了裂隙')
            this.speed = this.minSpeed;
        }
    }

    private destroyCoin(whichNode: Node) {
        if (whichNode) {
            whichNode.destroy();
        }
    }

    public setCamera(flag = false) { //设置相机位置 //true为实时更新
        if (!flag) {
            this.camera.setWorldPosition(this._cameraPos)
        } else {
            //console.log(this.node.worldPosition.y, this.node.position.z);
            this.camera.setWorldPosition(this.node.worldPosition.x, this.node.worldPosition.y + 6,
                this.node.worldPosition.z - 11.5)
        }

    }
    private _setMoveType() {    //赛车左滑右滑
        this._offsetPos.set(this.node.worldPosition)

        if (this._moveType == 'left') { //左滑


            this._rotateY.set(0, 30, 0)


            //往左边滑
            this._targetPostion = this.leftStartPos.worldPosition;
            this.x = this._targetPostion.x - this._offsetPos.x;

            if (this.x !== 0) {
                this._offsetPos.x += 0.2
                //console.log('xxxx', this._offsetPos.x, this._targetPostion.x)
                this.node.eulerAngles = this._rotateY  //设置左滑右滑角度
                if (this._offsetPos.x > this._targetPostion.x) {
                    this._rotateY.set(0, 0, 0)
                    this.node.eulerAngles = this._rotateY
                    this._offsetPos.x = this._targetPostion.x
                }
            }
            // }

        } else if (this._moveType == 'right') {

            this._targetPostion = this.rightStartPos.worldPosition;
            this.x = this._targetPostion.x - this._offsetPos.x;
            this._rotateY.set(0, -30, 0)
            // console.log('右滑判断')
            if (this.x !== 0) {
                this._offsetPos.x -= 0.2
                // console.log('xxxx', this._offsetPos.x, this._targetPostion.x)
                this.node.eulerAngles = this._rotateY  //设置左滑右滑角度
                if (this._offsetPos.x < this._targetPostion.x) {
                    this._rotateY.set(0, 0, 0)
                    this.node.eulerAngles = this._rotateY
                    this._offsetPos.x = this._targetPostion.x
                }
            }

        } else if (this._moveType == 'center') {
            // console.log('回到中间')

            if (this._offsetPos.x < -2.784) {  //从右边回到中间位置
                this._offsetPos.x += 0.2

                this._rotateY.set(0, 30, 0)
                this.node.eulerAngles = this._rotateY  //设置左滑右滑角度
                if (this._offsetPos.x > -2.784) {
                    this._rotateY.set(0, 0, 0)
                    this.node.eulerAngles = this._rotateY
                    this._offsetPos.x = -2.784
                }
            } else {    //从左边回到中间
                this._offsetPos.x -= 0.2
                this._rotateY.set(0, -30, 0)
                this.node.eulerAngles = this._rotateY  //设置左滑右滑角度
                if (this._offsetPos.x < -2.784) {
                    this._rotateY.set(0, 0, 0)
                    this.node.eulerAngles = this._rotateY
                    this._offsetPos.x = -2.784
                }
            }

        }
        this.node.setWorldPosition(this._offsetPos)

    }
    private _running() { //赛车移动

        // console.log('移动>>>>>>>')
        this._offsetPos.set(this.node.worldPosition)
        const z = this._endPos.z - this._offsetPos.z

        // console.log('移动>>>>>>>',z)
        if (z !== 0) {
            if (z > 0) {
                this._offsetPos.z += this.speed;
                if (this._offsetPos.z > this._endPos.z) {
                    this._offsetPos.z = this._endPos.z
                }
            }
        }
        // console.log(this._offsetPos,this.speed,'设置坐标点')
        this.node.setWorldPosition(this._offsetPos)


        Vec3.subtract(this.temVec, this._endPos, this._offsetPos) //判断起点 -- 终点的距离
        if (this.temVec.length() <= 0.01) {

            this._isMove = false    //到终点了
            customerListener.dispatch(Constants.GameStatus.GAME_OVER)   //游戏结束
        }

    }
    public setNode(entry: Node) { //设置起跑点
        console.log('设置起跑点')
        this._startPos = entry.getWorldPosition();
        this._endPos = entry.getComponent(RoadPoints).nextStation.worldPosition;
        this.node.setWorldPosition(this._startPos)
        this._colliderInit()
    }
    public setMoveType(type: string) {  //控制移动方式
        this._moveType = type
    }
    // public controlMove(flag = true) {    //控制是否移动


    //     this._isMove = flag

    // }


}
