const { execAsync } = ags.Utils;
const { Icon } = ags.Widget;
import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';

export default () => PanelButton({
    className: 'panel-button screenshot',
    content: Icon({
        icon: icons.screenshot,
    }),
    onClicked: () => {
        execAsync(['bash', '-c', "~/.config/scripts/screenshot.sh 1"]).catch(print);
    },
    onSecondaryClick: () => {
        execAsync(['bash', '-c', "~/.config/scripts/screenshot.sh"]).catch(print);
    },
});
