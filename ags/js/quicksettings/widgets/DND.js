import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import icons from '../../icons.js';
import { SimpleToggleButton } from '../ToggleButton.js';

export default () => SimpleToggleButton({
    icon: Widget.Box({
        children: [
            Widget.Icon({
                connections: [[Notifications, icon => {
                    icon.icon = Notifications.dnd
                        ? icons.notifications.silent
                        : icons.notifications.noisy;
                }, 'notify::dnd']],
            }),
            Widget.Label({
                connections: [[Notifications, label => {
                    label.label = Notifications.dnd ? 'Silent' : 'Noisy';
                }]],
            }),
        ]
    }),
    toggle: () => Notifications.dnd = !Notifications.dnd,
    connection: [Notifications, () => Notifications.dnd],
});
