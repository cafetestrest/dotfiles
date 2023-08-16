const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

let first = false;

class NoteService extends Service {
    static { Service.register(this); }

    get callNote() {
        execAsync(['bash', '-c', "~/.config/waybar/scripts/note.sh ags"]).catch(print);
        // this.emit('changed');
    }

    constructor() {
        super();
        this._note = null;
    }

    get note() { return this._note; }
    setNote(text) { this._note = text; }
}

class Note {
    static { Service.export(this, 'Note'); }
    static instance = new NoteService;
    static get callNote() { return Note.instance.callNote; }

    static get note() { return Note.instance.note; }
    static setNote(text) { Note.instance.setNote(text); }
}

Widget.widgets['note'] = props => Widget({
    child: {
        type: 'font-icon',
        icon: '',
    },
    ...props,
    type: 'button',
    tooltip: '',
    onClick: () => {
        execAsync(['bash', '-c', "codium ~/Documents/note"]).catch(print);
    },
    connections: [[60000, button => {
        if (!first) {
            first = true;
        } else {
            Note.callNote
        }

        let tooltip = Note.note;

        if (tooltip) {
            button.set_tooltip_text(tooltip);
        }
    }]],
    onSecondaryClick: Note.callNote
});
