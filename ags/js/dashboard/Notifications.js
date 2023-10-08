import NotificationColumn from './NotificationColumn.js';
import PopupWindow from '../misc/PopupWindow.js';

export default ({ anchor = ['top'], layout = 'top' } = {}) => PopupWindow({
    name: 'notification',
    layout,
    anchor,
    content: ags.Widget.Box({
        className: 'dashboard',
        children: [
            NotificationColumn(),
        ],
    }),
});
