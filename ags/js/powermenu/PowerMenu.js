import icons from '../icons.js';
import PowerMenu from '../services/powermenu.js';
import PopupWindow from '../misc/PopupWindow.js';
import { Widget } from '../imports.js';

const SysButton = (action, label) => Widget.Button({
    onClicked: () => PowerMenu.action(action),
    child: Widget.Box({
        vertical: true,
        children: [
            Widget.Icon(icons.powermenu[action]),
            // Widget.Label(label),
        ],
    }),
});

export default () => PopupWindow({
    name: 'powermenu',
    expand: true,
    content: Widget.Box({
        className: 'powermenu',
        homogeneous: true,
        children: [
            SysButton('lock', 'Lock'),
            SysButton('sleep', 'Sleep'),
            SysButton('logout', 'Log Out'),
            SysButton('reboot', 'Reboot'),
            SysButton('shutdown', 'Shutdown'),
        ],
    }),
});
