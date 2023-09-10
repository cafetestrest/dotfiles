const { Service } = ags;
const { exec, execAsync } = ags.Utils;

class IdleService extends Service {
    static { Service.register(this); }

    checkMode() {
        execAsync(['bash', '-c', "~/.config/scripts/swayidle.sh toggle"]).catch(print);

        if (this._mode == 'on') {
            this._mode = 'off';
        } else {
            this._mode = 'on';
        }

        this.emit('changed');
    }

    constructor() {
        super();
        this._mode = exec('pidof swayidle') ? 'on' : 'off';
    }

    get mode() { return this._mode; }
}

export default class Idle {
    static instance = new IdleService();

    static checkMode() { Idle.instance.checkMode(); }
    static get mode() { return Idle.instance.mode; }
}
