import { Clock } from '../../modules/clock.js';
import { Separator } from '../../modules/misc.js';
import { Wallpaper } from '../../modules/wallpaper.js';
import * as datemenu from './datemenu.js';
import * as notifications from './notifications.js';
const { App } = ags;
const { Button, Box, Label } = ags.Widget;


export const PanelButton = ({ format } = {}) => Button({
    className: 'dashboard panel-button',
    onClicked: () => App.toggleWindow('dashboard'),
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'dashboard' && visible);
    }]],
    child: Clock({
        format,
        justification: 'center',
    }),
});

export const PopupContent2 = () => Box({
    className: 'dashboard',
    vexpand: false,
    children: [
        Box({
            vertical: true,
            children: [datemenu.PopupContent()],
        }),
        Separator({ vexpand: true }),
        Box({
            className: 'notifications',
            vertical: true,
            children: [
                notifications.Header(),
                Box({
                    className: 'notification-list-box',
                    children: [
                        Wallpaper({
                            children: [notifications.List()],
                        }),
                    ],
                }),
            ],
        }),
    ],
});

export const PopupContent = () => Box({
    className: 'dashboard',
    vexpand: false,
    children: [
        Box({
            vertical: true,
            children: [datemenu.PopupContent()],
        }),
    ],
});

export const NotificationsPanelButton = ({ format } = {}) => Button({
    className: 'notifications-button panel-button',
    onClicked: () => App.toggleWindow('notificationsPopup'),
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'notificationsPopup' && visible);
    }]],
    child: notifications.PanelIndicator({ direction: 'right', hexpand: true }),
});

export const NotificationsPopupContent = () => Box({
    className: 'notifications-popup',
    vexpand: false,
    children: [
        Box({
            className: 'notifications',
            vertical: true,
            children: [
                notifications.Header(),
                Box({
                    className: 'notification-list-box',
                    children: [
                        Wallpaper({
                            children: [notifications.List()],
                        }),
                    ],
                }),
            ],
        }),
    ],
});
