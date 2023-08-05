const { App, Widget } = ags;
const { Notifications } = ags.Service;
const { timeout } = ags.Utils;

Widget.widgets['notifications/header'] = props => Widget({
    ...props,
    type: 'box',
    children: [
        { type: 'label', label: 'Notifications', hexpand: true, xalign: 0 },
        { type: 'notifications/clear-button' },
    ],
});

Widget.widgets['notifications/list'] = props => Widget({
    ...props,
    hscroll: 'never',
    vscroll: 'automatic',
    type: 'scrollable',
    child: {
        type: 'box',
        orientation: 'vertical',
        children: [
            { type: 'notifications/notification-list' },
            {
                type: 'notifications/placeholder',
                className: 'placeholder',
                orientation: 'vertical',
                valign: 'center',
                vexpand: true,
                children: [
                    { type: 'label', label: '󰂛', className: 'icon' },
                    'Your inbox is empty',
                ],
            },
        ],
    },
});

Widget.widgets['notifications/panel-indicator'] = ({ direction = 'left', ...props }) => Widget({
    ...props,
    type: 'box',
    connections: [[Notifications, box => {
        box.visible =
            Notifications.notifications.size > 0 &&
            !Notifications.dnd;
    }]],
    children: [{
        type: 'hover-revealer',
        connection: [Notifications, revealer => {
            const title = Array.from(Notifications.notifications)?.pop()?.[1].summary;
            if (revealer._title === title)
                return;

            revealer._title = title;
            revealer.reveal_child = true;
            timeout(3000, () => {
                revealer.reveal_child = false;
            });
        }],
        direction,
        indicator: { type: 'notifications/dnd-indicator' },
        child: {
            type: 'label',
            connections: [[Notifications, label => {
                label.label = Array.from(Notifications.notifications)?.pop()?.[1].summary || '';
            }]],
        },
    }],
});

Widget.widgets['notifications/panel-button'] = props => Widget({
    ...props,
    type: 'button',
    className: 'notifications-button panel-button',
    onClick: () => App.toggleWindow('notificationsPopup'),
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'notificationsPopup' && visible);
    }]],
    child: { type: 'notifications/panel-indicator', direction: 'right', hexpand: true },
});

Widget.widgets['notifications/popup-content'] = () => Widget({
    type: 'box',
    className: 'notifications-popup',
    vexpand: false,
    children: [
        {
            type: 'box',
            className: 'notifications',
            orientation: 'vertical',
            children: [
                {
                    type: 'notifications/header',
                    className: 'header',
                },
                {
                    type: 'box',
                    className: 'notification-list-box',
                    children: [{
                        type: 'wallpaper',
                        children: [{
                            type: 'notifications/list',
                            className: 'notification-list',
                            vexpand: true,
                            hexpand: true,
                        }],
                    }],
                },
            ],
        },
    ],
});
