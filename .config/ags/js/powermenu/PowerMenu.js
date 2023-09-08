import icons from '../icons.js';
import PowerMenu from '../services/powermenu.js';
import PopupWindow from '../misc/PopupWindow.js';
const { Box, Icon, Label, Button } = ags.Widget;

const SysButton = (action, label) => Button({
    onClicked: () => PowerMenu.action(action),
    child: Box({
        vertical: true,
        children: [
            Icon(icons.powermenu[action]),
            // Label(label),
        ],
    }),
});

export default () => PopupWindow({
    name: 'powermenu',
    expand: true,
    content: Box({
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
