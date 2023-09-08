import icons from '../../icons.js';
import { SimpleToggleButton } from '../ToggleButton.js';
const { Audio } = ags.Service;
const { Icon, Label } = ags.Widget;

export default () => SimpleToggleButton({
    icon: Icon({
        connections: [[Audio, icon => {
            icon.icon = Audio.microphone?.isMuted
                ? icons.audio.mic.muted
                : icons.audio.mic.unmuted;
        }, 'microphone-changed']],
    }),
    // label: Label({
    //     connections: [[Audio, label => {
    //         label.label = Audio.microphone?.isMuted
    //             ? 'Muted' : 'Unmuted';
    //     }, 'microphone-changed']],
    // }),
    // toggle: 'pactl set-source-mute @DEFAULT_SOURCE@ toggle',
    toggle: 'pamixer --default-source -t',
    connection: [Audio, () => Audio.microphone?.isMuted],
});
