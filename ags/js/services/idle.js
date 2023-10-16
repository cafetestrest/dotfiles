import { Service, Utils } from '../imports.js';

class Idle extends Service {
    static { Service.register(this); }

    _mode = null;

	get mode() {
		return this._mode;
	}

	set mode(value) {
        this._mode = value;

        if (value) {
            Utils.execAsync(['bash', '-c', "~/.config/scripts/swayidle.sh startup"]).catch(print);
        } else {
            Utils.execAsync("pkill swayidle").catch(print);
        }
        this.emit('changed');
	}

	constructor() {
		super();
		this._mode = Utils.exec('pidof swayidle') ? true : false;
	}
}

export default new Idle();
