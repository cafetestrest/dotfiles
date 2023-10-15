import { Service, Utils } from '../imports.js';

class Nightlight extends Service {
    static { Service.register(this); }

    checkMode() {
        if (this._mode === "auto") {
            Utils.execAsync(['bash', '-c', "~/.config/scripts/nightlight.sh enable"]).catch(print);
            this._mode = "on";
        } else if (this._mode === "on") {
            Utils.execAsync(['bash', '-c', "~/.config/scripts/nightlight.sh disable"]).catch(print);
            this._mode = "off";
        } else {
            Utils.execAsync(['bash', '-c', "~/.config/scripts/nightlight.sh automatic"]).catch(print);
            this._mode = "auto";
        }

        this.emit('changed');
    }

    constructor() {
        super();

        this._mode = Utils.exec('pidof wlsunset') ? 'auto' : 'off';
    }

    get mode() { return this._mode; }
}

export default new Nightlight();
