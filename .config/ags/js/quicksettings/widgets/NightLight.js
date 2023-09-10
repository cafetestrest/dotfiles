import Nightlight from '../../services/nightlight.js';
import { SimpleToggleButton } from '../ToggleButton.js';
import icons from '../../icons.js';
const { Icon, Label } = ags.Widget;

export const NightlightIndicator = () => Icon({
    connections: [[Nightlight, icon => {
        icon.icon = icons.nightlight[Nightlight.mode];
    }]],
});

export const NightlightToggle = () => SimpleToggleButton({
    icon: NightlightIndicator(),
    label: Label({
        connections: [[Nightlight, label => {
            let mode = Nightlight.mode;
            console.log('mode ' + mode)

            let text;
            if (mode === 'auto') {
                text = 'Auto';
            } else if (mode === 'on') {
                text = 'Enabled';
            } else {
                text = 'Disabled';
            }
            label.label = text;
        }]],
    }),
    toggle: Nightlight.checkMode,
    connection: [Nightlight, () => Nightlight.mode]
});
