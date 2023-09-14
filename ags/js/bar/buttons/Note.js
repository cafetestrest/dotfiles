const { execAsync } = ags.Utils;
const { Icon } = ags.Widget;
import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
// import Note from '../../services/note.js';

// let first = false;

export default () => PanelButton({
    className: 'panel-button note',
    content: Icon({
        icon: icons.note,
    }),
    onClicked: () => {
        execAsync(['bash', '-c', "codium ~/Documents/note"]).catch(print);
    },
    onSecondaryClick: () => {
        execAsync(['bash', '-c', "codium ~/Documents/note"]).catch(print);
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
