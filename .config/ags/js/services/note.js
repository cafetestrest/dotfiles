const { Service } = ags;
const { execAsync } = ags.Utils;

class NoteService extends Service {
    static { Service.register(this); }

    get callNote() {
        console.log('callNote')
        execAsync(['bash', '-c', "~/.config/scripts/note.sh ags"]).catch(print);
        // this.emit('changed');
    }

    constructor() {
        super();
        this._note = null;
    }

    get note() { return this._note; }
    setNote(text) { this._note = text; }
}

export default class Note {
    static { Service.Note = this; }
    static instance = new NoteService();

    static get callNote() { return Note.instance.callNote; }

    static get note() { return Note.instance.note; }
    static setNote(text) { Note.instance.setNote(text); }
}
