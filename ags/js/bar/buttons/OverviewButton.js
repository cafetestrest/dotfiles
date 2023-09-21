import PanelButton from '../PanelButton.js';
import FontIcon from '../../misc/FontIcon.js';
import { distroIcon } from '../../variables.js';
const { execAsync } = ags.Utils;

export default () => PanelButton({
    className: 'overview',
    connections: [[ags.App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'overview' && visible);
    }]],
    onClicked: () => ags.App.toggleWindow('applauncher'),
    // onClicked: () => execAsync(['bash', '-c', "pkill rofi || rofi -show drun -config ~/.config/rofi/spotlight.rasi"]).catch(print),
    content: FontIcon(distroIcon),
});
