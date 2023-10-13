import { PopupContent } from '../bar/buttons/Weather.js';
import PopupWindow from '../misc/PopupWindow.js';
import { Widget } from '../imports.js';

export default ({ anchor = ['top'], layout = 'top' } = {}) => PopupWindow({
    name: 'weather',
    layout,
    anchor,
    content: Widget.Box({
        className: 'dashboard',
        children: [
            PopupContent(),
        ],
    }),
});
