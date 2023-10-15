import { Service, Utils } from '../imports.js';

class IdleService extends Service {
    static { Service.register(this); }

    checkMode() {
        Utils.execAsync(['bash', '-c', "~/.config/scripts/swayidle.sh toggle"]).catch(print);

        if (this._mode == 'on') {
            this._mode = 'off';
        } else {
            this._mode = 'on';
        }

        this.emit('changed');
    }

    constructor() {
        super();
        this._mode = Utils.exec('pidof swayidle') ? 'on' : 'off';
    }

    get mode() { return this._mode; }
}

export default class Idle {
    static { Service.Idle = this; }
    static instance = new IdleService();

    static checkMode() { Idle.instance.checkMode(); }
    static get mode() { return Idle.instance.mode; }
}
