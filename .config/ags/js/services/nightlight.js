const { Service } = ags;
const { exec, execAsync } = ags.Utils;

class NightlightService extends Service {
    static { Service.register(this); }

    checkMode() {
        if (this._mode === "auto") {
            execAsync(['bash', '-c', "~/.config/scripts/nightlight.sh enable"]).catch(print);
            this._mode = "on";
        } else if (this._mode === "on") {
            execAsync(['bash', '-c', "~/.config/scripts/nightlight.sh disable"]).catch(print);
            this._mode = "off";
        } else {
            execAsync(['bash', '-c', "~/.config/scripts/nightlight.sh automatic"]).catch(print);
            this._mode = "auto";
        }

        this.emit('changed');
    }

    constructor() {
        super();

        this._mode = exec('pidof wlsunset') ? 'auto' : 'off';
    }

    get mode() { return this._mode; }
}

export default class Nightlight {
    static instance = new NightlightService();

    static checkMode() { Nightlight.instance.checkMode(); }
    static get mode() { return Nightlight.instance.mode; }
}
