const { Service } = ags;
const { execAsync } = ags.Utils;
const { Button, Icon } = ags.Widget;

let first = false;

class NoteService extends Service {
    static { Service.register(this); }

    get callNote() {
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

class Note {
    static { Service.export(this, 'Note'); }
    static instance = new NoteService;
    static get callNote() { return Note.instance.callNote; }

    static get note() { return Note.instance.note; }
    static setNote(text) { Note.instance.setNote(text); }
}

export const NoteWidget = props => Button({
    ...props,
    child: Icon({ icon: 'user-bookmarks-symbolic' }),
    tooltipText: '',
    onClicked: () => {
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
});
