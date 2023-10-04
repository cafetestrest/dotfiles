import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
// import Note from '../../services/note.js';

import { Widget, Utils } from '../../imports.js';

// let first = false;

export default () => PanelButton({
    className: 'panel-button note',
    content: Widget.Icon({
        icon: icons.note,
    }),
    onClicked: () => {
        Utils.execAsync(['bash', '-c', "codium ~/Documents/note"]).catch(print);
    },
    onSecondaryClick: () => {
        Utils.execAsync(['bash', '-c', "codium ~/Documents/note"]).catch(print);
    },
    // connections: [[60000, button => {
    //     if (!first) {
    //         first = true;
    //     } else {
    //         Note.callNote
    //     }

    //     let tooltip = Note.note;

    //     if (tooltip) {
    //         button.set_tooltip_text(tooltip);
    //     }
    // }]],
});
