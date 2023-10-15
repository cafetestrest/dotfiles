import { Service, Utils } from '../imports.js';

class BtDeviceInfo extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._data = null;

        this.call();
    }

    call() {
        Utils.execAsync(['bash', '-c', "~/.config/scripts/bluetoothbatterypercentage.sh ags"]).catch(print);
    }

    get callBtDeviceInfoScript() {
        this.call()
    }

    get data() { return this._data; }
    setData(text) { this._data = text }
}

export default new BtDeviceInfo();
