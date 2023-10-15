import { Service, Utils } from '../imports.js';

class Idle extends Service {
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

export default new Idle();
