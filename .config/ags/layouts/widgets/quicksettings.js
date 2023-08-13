const { Widget, Service, App } = ags;
const { Bluetooth, Battery, Audio, Network, Theme } = Service;
const { execAsync, timeout, USER } = ags.Utils;

class QSMenu extends Service {
    static { Service.register(this); }
    static instance = new QSMenu();
    static opened = '';
    static toggle(menu) {
        QSMenu.opened = QSMenu.opened === menu ? '' : menu;
        QSMenu.instance.emit('changed');
    }

    constructor() {
        super();
        App.instance.connect('window-toggled', (_a, name, visible) => {
            if (name === 'quicksettings' && !visible) {
                QSMenu.opened = '';
                QSMenu.instance.emit('changed');
            }
        });
    }
}

const arrow = (menu, toggleOn) => ({
    type: 'button',
    className: 'arrow',
    onClick: () => {
        QSMenu.toggle(menu);
        if (toggleOn)
            toggleOn();
    },
    connections: [[QSMenu, button => {
        button.toggleClassName('opened', QSMenu.opened === menu);
    }]],
    child: {
        type: 'icon',
        className: 'arrow-icon',
        icon: 'pan-end-symbolic',
        properties: [
            ['deg', 0],
            ['opened', false],
        ],
        connections: [[QSMenu, icon => {
            if (QSMenu.opened === menu && !icon._opened || QSMenu.opened !== menu && icon._opened) {
                const step = QSMenu.opened === menu ? 10 : -10;
                icon._opened = !icon._opened;
                for (let i = 0; i < 9; ++i) {
                    timeout(5 * i, () => {
                        icon._deg += step;
                        icon.setStyle(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                    });
                }
            }
        }]],
    },
});

const wideToggle = ({ icon, label, toggle, status, name }) => ({
    type: toggle,
    className: `toggle ${name}`,
    child: {
        type: 'box',
        orientation: 'horizontal',
        valign: 'center',
        children: [
            {
                type: 'button',
                valign: 'center',
                hexpand: true,
                child: {
                    type: 'box',
                    children: [
                        {
                            type: 'box',
                            className: 'quicksettings__button_icon',
                            orientation: 'horizontal',
                            children: [
                                { type: icon },
                            ],
                        },
                        {
                            type: 'box',
                            orientation: 'vertical',
                            hexpand: false,
                            children: [
                                {
                                    type: label,
                                    className: 'text__bold',
                                    halign: 'start',
                                },
                                {
                                    type: status,
                                    halign: 'start',
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
});

const menu = (name, child) => ({
    type: 'box',
    children: [{
        type: 'revealer',
        transition: 'slide_down',
        connections: [[QSMenu, r => r.reveal_child = name === QSMenu.opened]],
        child,
    }],
});

const avatar = {
    type: 'box',
    className: 'avatar',
    children: [{
        type: 'avatar',
        child: {
            type: 'label',
            className: 'user',
            halign: 'start',
            valign: 'end',
            label: '@' + USER,
        },
    }],
};

const sysBtn = (icon, action, className = '') => ({
    type: 'button',
    className,
    onClick: () => Service.System.action(action),
    tooltip: action,
    child: {
        type: 'icon',
        icon,
    },
});

const systemBox = {
    type: 'box',
    orientation: 'vertical',
    halign: 'end',
    valign: 'center',
    children: [
        {
            type: 'box',
            valign: 'center',
            className: 'system',
            children: [
                {
                    type: 'button',
                    className: 'settings',
                    onClick: () => { App.toggleWindow('quicksettings'); Theme.openSettings(); },
                    tooltip: 'Settings',
                    child: {
                        type: 'icon',
                        icon: 'org.gnome.Settings-symbolic',
                    },
                },
                {
                    type: 'box',
                    className: 'uptime',
                    children: ['uptime: ', { type: 'uptime' }],
                },
                sysBtn('system-log-out-symbolic', 'Log Out'),
                sysBtn('system-shutdown-symbolic', 'Shutdown', 'shutdown'),
            ],
        },
        // { type: 'battery/progress' },
    ],
};

const volume = {
    type: 'box',
    orientation: 'vertical',
    className: 'volume-box',
    children: [
        {
            type: 'box',
            className: 'volume',
            children: [
                {
                    type: 'button',
                    className: 'volume-button',
                    child: { type: 'audio/speaker-type-indicator' },
                    onClick: 'pamixer --default-source -t',
                },
                { className: 'slider', type: 'audio/speaker-slider', hexpand: true },
                { type: 'box', children: [{ type: 'audio/speaker-percent-label' }, '%'] },
                arrow('stream-selector'),
            ],
        },
        menu('stream-selector', {
            type: 'box',
            orientation: 'vertical',
            className: 'menu',
            children: [
                { type: 'audio/stream-selector' },
                { type: 'separator' },
                {
                    type: 'button',
                    onClick: () => {
                        execAsync('pavucontrol').catch(print);
                        App.closeWindow('quicksettings');
                    },
                    child: {
                        type: 'label',
                        label: 'Settings',
                        xalign: 0,
                    },
                },
            ],
        }),
    ],
};

const speaker = {
    type: 'box',
    className: 'speaker-box',
    halign: 'end',
    children: [
        {
            type: 'audio/speaker-indicator',
        },
        ' ',
        {
            type: 'audio/speaker-percent-label',
        },
        '%',
    ],
};

const usageCpu = {
    type: 'box',
    className: 'usagecpu-box',
    halign: 'end',
    children: [
        {
            type: 'usagecpu-indicator',
        },
        ' ',
        {
            type: 'usagecpu',
        },
        '%',
    ],
};

const usageMemory = {
    type: 'box',
    className: 'usagememory-box',
    halign: 'end',
    children: [
        {
            type: 'usagememory-indicator',
        },
        ' ',
        {
            type: 'usagememory',
        },
        // '%',
    ],
};

const usageStorage = {
    type: 'box',
    className: 'usagestorage-box',
    halign: 'end',
    children: [
        {
            type: 'usagestorage-indicator',
        },
        ' ',
        {
            type: 'usagestorage',
        },
        // '%',
    ],
};

const brightness = {
    type: 'box',
    className: 'brightness',
    children: [
        {
            type: 'button',
            onClick: () => {
                execAsync('wl-gammactl').catch(print);
                App.closeWindow('quicksettings');
            },
            child: { type: 'brightness/icon' },
        },
        { className: 'slider', type: 'brightness/slider', hexpand: true },
        { type: 'box', children: [{ type: 'brightness/percent' }, '%'] },
    ],
};

const arrowToggle = ({ icon, label, connection, toggle, name, toggleOn }) => ({
    type: 'box',
    connections: [[
        connection[0],
        w => w.toggleClassName('active', connection[1]()),
    ]],
    className: `arrow toggle ${name}`,
    children: [
        {
            type: 'button',
            hexpand: true,
            className: 'toggle',
            onClick: toggle,
            child: {
                type: 'box',
                children: [
                    { type: icon },
                    { type: label },
                ],
            },
        },
        arrow(name, toggleOn),
    ],
});

const networkToggle = arrowToggle({
    icon: 'network/wifi-indicator',
    label: 'network/ssid-label',
    connection: [Network, () => Network.wifi?.enabled],
    toggle: Network.toggleWifi,
    toggleOn: () => {
        Network.wifi.enabled = true;
        Network.wifi.scan();
    },
    name: 'network',
});

const bluetoothToggle = arrowToggle({
    icon: 'bluetooth/indicator',
    label: 'bluetooth/label',
    connection: [Bluetooth, () => Bluetooth.enabled],
    toggle: () => Bluetooth.enabled = !Bluetooth.enabled,
    toggleOn: () => {
        Bluetooth.enabled = QSMenu.opened === 'bluetooth'
            ? true : Bluetooth.enabled;
    },
    name: 'bluetooth',
});

const smallToggle = (toggle, indicator) => ({
    className: 'toggle',
    halign: 'fill',
    hexpand: true,
    vexpand: true,
    type: toggle,
    child: { type: indicator, halign: 'center' },
});

const notificationsToggle = wideToggle({
    icon: 'notifications/dnd-indicator',
    label: 'notifications/label',
    toggle: 'notifications/dnd-toggle',
    status: 'notifications/status-label',
    name: 'notificationsToggle',
});

const wideIdleToggle = wideToggle({
    icon: 'idle/indicator',
    label: 'idle/label',
    toggle: 'idle/toggle',
    status: 'idle/status-label',
    name: 'idleToggle',
});

const wideMuteToggle = wideToggle({
    icon: 'audio/microphone-mute-indicator',
    label: 'audio/microphone-mute-label',
    toggle: 'audio/microphone-mute-toggle',
    status: 'audio/microphone-mute-status-label',
    name: 'microphoneToggle',
});

const wideNightlightToggle = wideToggle({
    icon: 'nightlight/mode-indicator',
    label: 'nightlight/label',
    toggle: 'nightlight/mode-toggle',
    status: 'nightlight/status-label',
    name: 'idleToggle',
});

const dndToggle = smallToggle(
    'notifications/dnd-toggle',
    'notifications/dnd-indicator',
);

const muteToggle = smallToggle(
    'audio/microphone-mute-toggle',
    'audio/microphone-mute-indicator',
);

const idleToggle = smallToggle(
    'idle/toggle',
    'idle/indicator',
);

const asusctlToggle = smallToggle(
    'asusctl/profile-toggle',
    'asusctl/profile-indicator',
);

const asusmodeToggle = smallToggle(
    'asusctl/mode-toggle',
    'asusctl/mode-indicator',
);

const nightlightToggle = smallToggle(
    'nightlight/mode-toggle',
    'nightlight/mode-indicator',
);

const themeToggle = {
    className: 'toggle',
    type: 'button',
    onClick: () => QSMenu.toggle('theme'),
    child: { type: 'theme/indicator' },
    connections: [[QSMenu, w => w.toggleClassName('on', QSMenu.opened === 'theme')]],
};

const appmixerToggle = {
    className: 'toggle',
    type: 'button',
    onClick: () => QSMenu.toggle('app-mixer'),
    child: { type: 'font-icon', icon: '' },
    connections: [[QSMenu, w => w.toggleClassName('on', QSMenu.opened === 'app-mixer')]],
};

const submenu = ({ menuName, icon, title, contentType }) => menu(menuName, {
    type: 'box',
    orientation: 'vertical',
    className: `submenu ${menuName}`,
    children: [
        { className: 'title', type: 'box', children: [icon, title] },
        { className: 'content', type: contentType, hexpand: true },
    ],
});

const appmixer = submenu({
    menuName: 'app-mixer',
    icon: { type: 'font-icon', icon: '' },
    title: 'App Mixer',
    contentType: 'audio/app-mixer',
});

const networkSelection = submenu({
    menuName: 'network',
    icon: { type: 'icon', icon: 'network-wireless-symbolic' },
    title: 'Wireless Networks',
    contentType: 'network/wifi-selection',
});

const bluetoothSelection = submenu({
    menuName: 'bluetooth',
    icon: { type: 'icon', icon: 'bluetooth-symbolic' },
    title: 'Bluetooth',
    contentType: 'bluetooth/devices',
});

const themeSelection = submenu({
    menuName: 'theme',
    icon: { type: 'icon', icon: 'preferences-desktop-theme-symbolic' },
    title: 'Theme',
    contentType: 'theme/selector',
});

Widget.widgets['quicksettings/popup-content'] = () => Widget({
    type: 'box',
    className: 'quicksettings',
    orientation: 'vertical',
    hexpand: false,
    children: [
        // {
        //     type: 'box',
        //     className: 'header',
        //     children: [
        //         avatar,
        //         systemBox,
        //     ],
        // },
        {
            type: 'box',
            className: 'qstoggles',
            children: [
            {
                type: 'box',
                className: 'witharrow',
                orientation: 'vertical',
                children: [bluetoothToggle, ],
            },
            {
                type: 'box',
                className: 'noarrow',
                orientation: 'vertical',
                children: [wideIdleToggle, ],
            },
        ]},
        {
            type: 'box',
            className: 'bluetoothSelection',
            orientation: 'vertical',
            children: [bluetoothSelection, ],
        },
        {
            type: 'box',
            className: 'qstoggles',
            children: [
            {
                type: 'box',
                className: 'noarrow',
                orientation: 'vertical',
                children: [notificationsToggle, ],
            },
            {
                type: 'box',
                className: 'noarrow',
                orientation: 'vertical',
                children: [wideNightlightToggle, ],
            },
        ]},
        {
            type: 'box',
            className: 'qsvolume',
            children: [
                volume
            ],
        },
        // {
        //     type: 'box',
        //     className: 'qsmediavolume',
        //     children: [
        //         volume
        //     ],
        // },
        // brightness,
        // {
        //     type: 'box',
        //     className: 'toggles-box',
        //     children: [
        //         {
        //             type: 'box',
        //             orientation: 'vertical',
        //             className: 'arrow-toggles',
        //             // children: [networkToggle, bluetoothToggle],
        //             children: [bluetoothToggle],
        //         },
        //         {
        //             type: 'box',
        //             orientation: 'vertical',
        //             className: 'small-toggles',
        //             vexpand: true,
        //             hexpand: false,
        //             // children: Service.Asusctl?.available
        //             //     ? [
        //             //         { type: 'box', children: [asusmodeToggle, asusctlToggle, dndToggle] },
        //             //         { type: 'box', children: [appmixerToggle, themeToggle, muteToggle] },
        //             //     ] : [
        //             //         { type: 'box', children: [dndToggle, muteToggle] },
        //             //         { type: 'box', children: [appmixerToggle, themeToggle] },
        //             //     ],
        //             children: [
        //                 // remove asus toggles if you are not on an asus laptop
        //                 { type: 'box', children: [idleToggle, nightlightToggle, themeToggle] },
        //                 { type: 'box', children: [appmixerToggle, dndToggle, muteToggle] },
        //             ],
        //         },
        //     ],
        // },
        appmixer,
        // networkSelection,
        themeSelection,
        // {
        //     type: 'media/popup-content',
        //     orientation: 'vertical',
        //     className: 'media',
        // },
    ],
});

Widget.widgets['quicksettings/panel-button'] = () => Widget({
    type: 'button',
    className: 'quicksettings panel-button',
    onClick: () => App.toggleWindow('quicksettings'),
    onScrollUp: () => {
        Audio.speaker.volume += 0.02;
        Service.Indicator.speaker();
    },
    onScrollDown: () => {
        Audio.speaker.volume -= 0.02;
        Service.Indicator.speaker();
    },
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'quicksettings' && visible);
    }]],
    child: {
        type: 'box',
        children: [
            // ...(Service.Asusctl?.available ? [
            //     { type: 'asusctl/profile-indicator', balanced: null },
            //     { type: 'asusctl/mode-indicator', hybrid: null },
            // ] : []),
            // { type: 'audio/microphone-mute-indicator', unmuted: null },
            { type: 'notifications/dnd-indicator', noisy: null },
            // {
            //     type: 'box',
            //     connections: [[Bluetooth, box => {
            //         box.get_children().forEach(ch => ch.destroy());
            //         for (const [, device] of Bluetooth.connectedDevices) {
            //             box.add(Widget({
            //                 type: 'hover-revealer',
            //                 indicator: { type: 'icon', icon: device.iconName + '-symbolic' },
            //                 child: { type: 'label', label: device.name },
            //             }));
            //         }
            //         box.show_all();
            //         box.visible = Bluetooth.connectedDevices.size > 0;
            //     }]],
            // },
            { type: 'nightlight/mode-indicator'},
            { type: 'idle/indicator'},
            { type: 'bluetooth/indicator', disabled: null },
            { type: 'network/indicator' },
            // { type: 'audio/speaker-indicator' },
            // {
            //     type: 'hover-revealer',
            //     direction: 'right',
            //     indicator: { type: 'battery/indicator', className: 'battery' },
            //     child: { type: 'battery/level-label' },
            //     connection: [Battery, revealer => {
            //         revealer.reveal_child = Battery.percent < 100;
            //     }],
            // },
            { type: 'audio/microphone-mute-indicator', unmuted: null },
            speaker
        ],
    },
});

Widget.widgets['usageCpu'] = () => Widget({
    type: 'box',
    className: 'panel-button',
    children: [
        usageCpu,
    ],
});

Widget.widgets['usageMemory'] = () => Widget({
    type: 'box',
    className: 'panel-button',
    children: [
        usageMemory,
    ],
});

Widget.widgets['usageStorage'] = () => Widget({
    type: 'box',
    className: 'panel-button',
    children: [
        usageStorage,
    ],
});

Widget.widgets['bluetooth/devices-battery'] = () => Widget({
    type: 'box',
    className: 'bluetooth devices',
    connections: [[Bluetooth, box => {
        box.get_children().forEach(ch => ch.destroy());
        for (const [, device] of Bluetooth.connectedDevices) {
            batteryPercentage = device.batteryPercentage;

            box.add(Widget({
                // type: 'hover-revealer',
                // indicator: { type: 'icon', icon: device.iconName + '-symbolic' },
                // child: { type: 'label', label: device.name },
                type: 'box',
                // indicator: { type: 'icon', icon: device.iconName + '-symbolic' },
                children: [
                    { type: 'icon', icon: device.iconName + '-symbolic', className: 'btdevice' },
                    { type: 'label', label: batteryPercentage !== 0 ? " " + batteryPercentage.toString() + "%" : "  " },
                ],
            }));
        }
        box.show_all();
        box.visible = Bluetooth.connectedDevices.size > 0;
    }]],
});
