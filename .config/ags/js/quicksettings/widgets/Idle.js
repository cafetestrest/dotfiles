import Idle from '../../services/idle.js';
import { SimpleToggleButton } from '../ToggleButton.js';
import icons from '../../icons.js';
const { Icon, Label } = ags.Widget;

export default () => SimpleToggleButton({
    icon: Icon({
        connections: [[Idle, icon => {
            icon.icon = Idle.mode == 'on'
                ? icons.idle.on
                : icons.idle.off;
        }]],
    }),
    label: Label({
        connections: [[Idle, label => {
            label.label = Idle.mode == 'on' ? 'Idle' : 'Off';
        }]],
    }),
    toggle: Idle.checkMode,
    connection: [Idle, () => Idle.mode == 'on']
});
