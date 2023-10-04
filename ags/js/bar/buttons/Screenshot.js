import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';

import { Widget, Utils } from '../../imports.js';

export default () => PanelButton({
    className: 'panel-button screenshot',
    content: Widget.Icon({
        icon: icons.screenshot,
    }),
    onClicked: () => {
        Utils.execAsync(['bash', '-c', "~/.config/scripts/screenshot.sh 1"]).catch(print);
    },
    onSecondaryClick: () => {
        Utils.execAsync(['bash', '-c', "~/.config/scripts/screenshot.sh"]).catch(print);
    },
});
