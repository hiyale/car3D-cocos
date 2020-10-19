import { _decorator, Component, Node, LabelComponent } from 'cc';
import { Constants } from '../Other/constants';
import { customerListener } from '../Other/listener';

const { ccclass, property } = _decorator;

@ccclass('StartTip')
export class StartTip extends Component {
    @property({
        type: LabelComponent,
    })

    txt: LabelComponent = null;
    private _count = 3;

    start() {
        customerListener.on(Constants.GameStatus.CLOSE_HELP, () => {
            this.schedule(this.tipEnd, 1)
        })
    }
    private tipEnd() {  //游戏开始321倒计时
        this._count--
        this.txt.string = this._count.toString()
        if (this._count == 0) {
            this.txt.string = 'GO！'
            this.scheduleOnce(() => {
                this.txt.node.active = false;
                this.unschedule(this.tipEnd)
                customerListener.dispatch(Constants.GameStatus.GAME_CLOCK)
                customerListener.dispatch(Constants.GameStatus.GAME_START)
            }, 1)

        }
    }
}
