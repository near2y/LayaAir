import { RotationInfo } from "././RotationInfo";
import { EventDispatcher } from "laya/events/EventDispatcher";
import { ILaya } from "ILaya";
import { Event } from "laya/events/Event";
/**
 * 使用Gyroscope.instance获取唯一的Gyroscope引用，请勿调用构造函数。
 *
 * <p>
 * listen()的回调处理器接受两个参数：
 * <code>function onOrientationChange(absolute:Boolean, info:RotationInfo):void</code>
 * <ol>
 * <li><b>absolute</b>: 指示设备是否可以提供绝对方位数据（指向地球坐标系），或者设备决定的任意坐标系。关于坐标系参见<i>https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained</i>。</li>
 * <li><b>info</b>: <code>RotationInfo</code>类型参数，保存设备的旋转值。</li>
 * </ol>
 * </p>
 *
 * <p>
 * 浏览器兼容性参见：<i>http://caniuse.com/#search=deviceorientation</i>
 * </p>
 */
export class Gyroscope extends EventDispatcher {
    constructor(singleton) {
        super();
        this.onDeviceOrientationChange = this.onDeviceOrientationChange.bind(this);
    }
    static get instance() {
        Gyroscope._instance = Gyroscope._instance || new Gyroscope(0);
        return Gyroscope._instance;
    }
    /**
     * 监视陀螺仪运动。
     * @param	observer	回调函数接受一个Boolean类型的<code>absolute</code>和<code>GyroscopeInfo</code>类型参数。
     */
    /*override*/ on(type, caller, listener, args = null) {
        super.on(type, caller, listener, args);
        ILaya.Browser.window.addEventListener('deviceorientation', this.onDeviceOrientationChange);
        return this;
    }
    /**
     * 取消指定处理器对陀螺仪的监视。
     * @param	observer
     */
    /*override*/ off(type, caller, listener, onceOnly = false) {
        if (!this.hasListener(type))
            ILaya.Browser.window.removeEventListener('deviceorientation', this.onDeviceOrientationChange);
        return super.off(type, caller, listener, onceOnly);
    }
    onDeviceOrientationChange(e) {
        Gyroscope.info.alpha = e.alpha;
        Gyroscope.info.beta = e.beta;
        Gyroscope.info.gamma = e.gamma;
        // 在Safari中
        if (e.webkitCompassHeading) {
            Gyroscope.info.alpha = e.webkitCompassHeading * -1;
            Gyroscope.info.compassAccuracy = e.webkitCompassAccuracy;
        }
        this.event(Event.CHANGE, [e.absolute, Gyroscope.info]);
    }
}
Gyroscope.info = new RotationInfo();