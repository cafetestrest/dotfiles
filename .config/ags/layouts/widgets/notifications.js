import { HoverRevealer } from '../../modules/misc.js';
import * as notifications from '../../modules/notifications.js';
const { App, Widget } = ags;
const { Notifications } = ags.Service;
const { timeout } = ags.Utils;
const { Box, Scrollable, Label } = ags.Widget;

export const Header = props => Box({
    ...props,
    className: 'header',
    children: [
        Label({ label: 'Notifications', hexpand: true, xalign: 0 }),
        notifications.ClearButton(),
    ],
});

export const List = props => Scrollable({
    ...props,
    hscroll: 'never',
    vscroll: 'automatic',
    child: Box({
        vertical: true,
        children: [
            notifications.NotificationList(),
            notifications.Placeholder(),
        ],
    }),
});

export const PanelIndicator = ({ direction = 'left', ...props } = {}) => Box({
    ...props,
    className: 'notifications panel-button',
    connections: [[Notifications, box => {
        box.visible =
            Notifications.notifications.size > 0 &&
            !Notifications.dnd;
    }]],
    children: [HoverRevealer({
        connections: [[Notifications, revealer => {
            const title = Array.from(Notifications.notifications)?.pop()?.[1].summary;
            if (revealer._title === title)
                return;

            revealer._title = title;
            revealer.reveal_child = true;
            timeout(3000, () => {
                revealer.reveal_child = false;
            });
        }]],
        direction,
        indicator: notifications.DNDIndicator(),
        child: Label({
            connections: [[Notifications, label => {
                label.label = Array.from(Notifications.notifications)?.pop()?.[1].summary || '';
            }]],
        }),
    })],
});

// Widget.widgets['notifications/panel-button'] = props => Widget({
//     ...props,
//     type: 'button',
//     className: 'notifications-button panel-button',
//     onClick: () => App.toggleWindow('notificationsPopup'),
//     connections: [[App, (btn, win, visible) => {
//         btn.toggleClassName('active', win === 'notificationsPopup' && visible);
//     }]],
//     child: { type: 'notifications/panel-indicator', direction: 'right', hexpand: true },
// });

// Widget.widgets['notifications/popup-content'] = () => Widget({
//     type: 'box',
//     className: 'notifications-popup',
//     vexpand: false,
//     children: [
//         {
//             type: 'box',
//             className: 'notifications',
//             orientation: 'vertical',
//             children: [
//                 {
//                     type: 'notifications/header',
//                     className: 'header',
//                 },
//                 {
//                     type: 'box',
//                     className: 'notification-list-box',
//                     children: [{
//                         type: 'wallpaper',
//                         children: [{
//                             type: 'notifications/list',
//                             className: 'notification-list',
//                             vexpand: true,
//                             hexpand: true,
//                         }],
//                     }],
//                 },
//             ],
//         },
//     ],
// }); todo
