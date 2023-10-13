import NotificationColumn from './NotificationColumn.js';
import PopupWindow from '../misc/PopupWindow.js';
import { Widget } from '../imports.js';

export default ({ anchor = ['top'], layout = 'top' } = {}) => PopupWindow({
    name: 'notification',
    layout,
    anchor,
    content: Widget.Box({
        className: 'dashboard',
        children: [
            NotificationColumn(),
        ],
    }),
});
