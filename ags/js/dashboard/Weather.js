import { PopupContent } from '../bar/buttons/Weather.js';
import PopupWindow from '../misc/PopupWindow.js';

export default ({ anchor = ['top'], layout = 'top' } = {}) => PopupWindow({
    name: 'weather',
    layout,
    anchor,
    content: ags.Widget.Box({
        className: 'dashboard',
        children: [
            PopupContent(),
        ],
    }),
});
