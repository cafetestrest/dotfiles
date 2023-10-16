import Idle from '../../services/idle.js';
import { SimpleToggleButton } from '../ToggleButton.js';
import icons from '../../icons.js';
import { Widget } from '../../imports.js';

export const IdleIndicator = () => Widget.Icon({
    connections: [[Idle, icon => {
        icon.icon = Idle.mode == true
            ? icons.idle.on
            : icons.idle.off;
    }]],
});

export const IdleToggle = () => SimpleToggleButton({
    icon: IdleIndicator(),
    label: Widget.Label({
        connections: [[Idle, label => {
            label.label = Idle.mode == true ? 'Timeout' : 'Always On';
        }]],
    }),
    toggle: () => Idle.mode = !Idle.mode,
    connection: [Idle, () => Idle.mode]
});
