import { _decorator, Component, Node, find } from 'cc';
import { Constants } from '../Other/constants';
import { customerListener } from '../Other/listener';
const { ccclass, property } = _decorator;

@ccclass('ClickEvent')
export class ClickEvent extends Component {

    public clickNext() {
        //next跳转外部链接
        console.log('next +++++++++++++++++++++')
        const _url = location.href.split('/')
        _url[_url.length - 1] = 'gameresult';
        location.href = _url.join('/')
    }
    public closeTipText() { //关闭操作提示文本框

        const tipTxt = find('Canvas/TipUI/operationTip')
        tipTxt.active = false;
        customerListener.dispatch(Constants.GameStatus.CLOSE_HELP)
    }

}
