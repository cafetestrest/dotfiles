import { Service, Utils } from '../imports.js';

class Note extends Service {
    static { Service.register(this); }

    get callNote() {
        Utils.execAsync(['bash', '-c', "~/.config/scripts/note.sh ags"]).catch(print);
        // this.emit('changed');
    }

    constructor() {
        super();
        this._note = null;
    }

    get note() { return this._note; }
    setNote(text) { this._note = text; }
}

export default new Note();
