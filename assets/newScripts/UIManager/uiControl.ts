import { _decorator, Component, Node, LabelComponent, SpriteComponent, find, AnimationComponent } from 'cc';
import { Constants } from '../Other/constants';
import { customerListener } from '../Other/listener';
import { ResourceManager } from '../ResourceManager';
import { IconController } from './IconController';
const { ccclass, property } = _decorator;

@ccclass('TabControl')
export class TabControl extends Component {


    @property({
        type: [LabelComponent],
    })
    progress: LabelComponent[] = [];


    @property({
        type: Node
    })
    coinTip: Node = null


    @property({
        type: Node
    })
    clock: Node = null


    @property({
        type: Node
    })
    AmazingTip: Node = null


    @property({
        type: Node
    })
    NextBtn: Node = null

    @property({
        type: Node
    })
    mainCar: Node = null     //获取赛车


    @property({
        type: LabelComponent
    })
    radioTxt: LabelComponent = null //秒表数字


    private _endPos: number = 3000     //赛车终点位置Z轴

    public countArr = [0, 0, 0]

    public timeCount = 1; //开始计时，每隔15S进行一次关卡替换


    private _progress2Node = null;
    private _progress3Node = null;

    private _coinTipTxt = null;

    private _clock = null

    private totalTime: number = null;

    public runingTime: number = 0;

    private doorOneTime: number = 5;
    private doorTwoTime: number = 20;
    private doorThreeTime: number = 35;

    private _level = 1; //根据距离来计算关卡，默认第一关

    update() {
        this._posTem();

    }

    start() {




        // Your initialization goes here.
        this.totalTime = find("Resource").getComponent(ResourceManager).totalTime;
        customerListener.on(Constants.GameStatus.GET_COIN, this._addProgressCouunt, this)
        customerListener.on(Constants.GameStatus.GAME_CLOCK, () => {

            this.clock.active = true;
            this.radioTxt.node.active = false;
            this.schedule(this._startSche, 1);
            this.schedule(this._updateRuning, 0.1);
        }, this)
        customerListener.on(Constants.GameStatus.GAME_OVER, this._gameOverEvent, this)

        this._clock = this.clock.getComponent(SpriteComponent)
        this._progress2Node = find('Canvas/GameUI/centerUI/tab/progress2').getComponent(SpriteComponent);
        this._progress3Node = find('Canvas/GameUI/centerUI/tab/progress3').getComponent(SpriteComponent);
        this._coinTipTxt = this.coinTip.getComponent(LabelComponent)
    }

    private _updateRuning() {
        this.runingTime += 0.1;
    }
    private _posTem() {  //计算赛车位置 -  终点距离 //游戏距离
        const _posZ = this.mainCar.getWorldPosition().z;
        const temp = this._endPos - _posZ

        if (Math.floor(temp) < 2300 && Math.floor(temp) > 1150) {
            this._level = 2;    //进入第二关
        } else if (Math.floor(temp) < 1150) {
            this._level = 3;    //进入第三关
        } else {
            this._level = 1;        //处于第一关
        }
        console.log(Math.floor(temp), this._level, '实时距离')


        //秒表更新
        this._clock.fillRange = Number((temp / (3000 + 950)).toFixed(2))


    }

    private _addProgressCouunt(count: number) {   //加分数


        // console.log('这里加分数', this._level)
        if (this._level == 2) {  //第二关
            this.countArr[1] += count;
            this.progress[1].string = this.countArr[1].toString()
            // console.log(this.progress[1].,'字体颜色')
            this.progress[1].color = new cc.color(255, 255, 255, 255);
            this._progress2Node.color = new cc.color(255, 255, 255, 255);


        } else if (this._level == 3) {  //第三关
            this.countArr[2] += count;
            this.progress[2].string = this.countArr[2].toString()

            this.progress[2].color = new cc.color(255, 255, 255, 255);
            this._progress3Node.color = new cc.color(255, 255, 255, 255);

        } else {    //第一关
            this.countArr[0] += count;
            this.progress[0].string = this.countArr[0].toString()
        }

        this.coinTip.active = true
        this._coinTipTxt.string = `+${count}`
        const ani = this.coinTip.getComponent(AnimationComponent)
        ani.play('coinAnim')    //播放加分数提示动画

    }

    private _startSche() {  //不知道checkCoinState方法干啥用的，先不注释了
        // this.timeCount++;
        this.checkCoinState();
        // this.runingTime = this.timeCount;

        // console.log(this.timeCount, '开始计时时间')
        // if (this.timeCount >= this.totalTime) {
        //     this.unschedule(this._startSche)    //取消定时器
        //     // this.AmazingTip.active = true;
        //     _clock.fillRange = 0
        //     // customerListener.dispatch(Constants.GameStatus.GAME_OVER)   //游戏结束
        //     // location.href += 'result'

        //     //将分数存入localStorage
        //     this.NextBtn.active = true
        //     localStorage.setItem('liftPoint', JSON.stringify(this.countArr[0]))
        //     localStorage.setItem('smoothPoint', JSON.stringify(this.countArr[1]))
        //     localStorage.setItem('replenishPoint', JSON.stringify(this.countArr[2]))
        // }
    }
    private _gameOverEvent() {   //判断终点的游戏结束响应事件
        //将分数存入localStorage
        this.NextBtn.active = true

        this._clock.fillRange = 0
        this.clock.active = false
        this.radioTxt.node.active = true;
        this.radioTxt.string = '0';

        this.unschedule(this._startSche)
        this.unschedule(this._updateRuning)    //取消定时器
        localStorage.setItem('liftPoint', JSON.stringify(this.countArr[0]))
        localStorage.setItem('smoothPoint', JSON.stringify(this.countArr[1]))
        localStorage.setItem('replenishPoint', JSON.stringify(this.countArr[2]))

    }
    private checkCoinState() {
        if (this.timeCount == this.doorTwoTime) {
            const icons: IconController[] = find("ItemsManager").getComponentsInChildren(IconController);
            icons.forEach(element => {
                element.showIcon("smooth");
            });
        }

        if (this.timeCount == this.doorThreeTime) {
            const icons: IconController[] = find("ItemsManager").getComponentsInChildren(IconController);
            icons.forEach(element => {
                element.showIcon("replenish");
            });
        }
    }

}
