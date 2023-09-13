const { Service } = ags;
const { execAsync } = ags.Utils;

class BtDeviceInfoService extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._data = null;

        this.call();
    }

    call() {
        execAsync(['bash', '-c', "~/.config/scripts/111.sh ags"]).catch(print);
    }

    get callBtDeviceInfoScript() {
        // execAsync(['bash', '-c', "~/.config/scripts/bluetoothbatterypercentage.sh ags"]).catch(print);
        this.call()
    }

    get data() { return this._data; }
    setData(text) { this._data = text }
}

export default class BtDeviceInfo {
    static { Service.BtDeviceInfo = this; }
    static instance = new BtDeviceInfoService();

    static get callBtDeviceInfoScript() { return BtDeviceInfo.instance.callBtDeviceInfoScript; }

    static get data() { return BtDeviceInfo.instance.data; }
    static setData(text) { BtDeviceInfo.instance.setData(text); }
}
