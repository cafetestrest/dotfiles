const Shared = imports.layouts.shared;

// static windows
const dock = Shared.dock;
const notifications = monitor => Shared.notifications(monitor, 'slide_down', ['top']);
const desktop = Shared.desktop;
const corners = Shared.corners;

// popups
const dashboard = {
    name: 'dashboard',
    popup: true,
    focusable: true,
    anchor: ['top'],
    child: {
        type: 'layout',
        layout: 'top',
        window: 'dashboard',
        child: { type: 'dashboard/popup-content' },
    },
};

const weather = {
    name: 'weather',
    popup: true,
    focusable: true,
    anchor: ['top'],
    child: {
        type: 'layout',
        layout: 'top',
        window: 'weather',
        child: { type: 'weather/popup-content' },
    },
};

const quicksettings = {
    name: 'quicksettings',
    popup: true,
    focusable: true,
    anchor: ['top', 'right'],
    child: {
        type: 'layout',
        layout: 'topright',
        window: 'quicksettings',
        child: { type: 'quicksettings/popup-content' },
    },
};

// bar
const { launcher } = imports.layouts.shared;
const separator = { type: 'separator', valign: 'center' };
const separatorinvisible = { type: 'separator-invisible', valign: 'center' };

const left = {
    type: 'box',
    className: 'left',
    children: [
        launcher(),
        separatorinvisible,
        // { type: 'workspaces', className: 'workspaces' },
        // separator,
        { type: 'workspaces-custom', className: 'workspaces' },
        // { type: 'client', className: 'client panel-button' },
        { type: 'media/panel-indicator', className: 'media panel-button', hexpand: true, halign: 'end' },
    ],
};

const center = {
    type: 'box',
    className: 'center',
    children: [
        { type: 'dashboard/panel-button' },
        { type: 'weather/panel-button' },
    ],
};

const right = {
    type: 'box',
    className: 'right',
    children: [
        { type: 'notifications/panel-indicator', direction: 'right', className: 'notifications panel-button' },
        { type: 'box', hexpand: true },
        { type: 'usageCpu' },
        { type: 'usageMemory' },
        { type: 'usageStorage' },
        // { type: 'recorder/indicator-button', className: 'recorder panel-button' },
        { type: 'colorpicker', className: 'colorpicker panel-button' },
        { type: 'screenshot', className: 'screenshot panel-button' },
        { type: 'clipboard', className: 'clipboard panel-button' },
        { type: 'note', className: 'note panel-button'},
        { type: 'quicksettings/panel-button' },
        separatorinvisible,
        { type: 'powermenu/panel-button' },
    ],
};

const bar = monitor => ({
    name: `bar${monitor}`,
    monitor,
    anchor: ['top', 'left', 'right'],
    exclusive: true,
    child: {
        type: 'centerbox',
        className: 'panel',
        children: [
            left,
            center,
            right,
        ],
    },
});

/* exported windows */
var windows = [
    ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
        // dock(id),
        notifications(id),
        // desktop(id),
        ...corners(id),
        bar(id),
    ])).flat(),
    dashboard,
    weather,
    quicksettings,
];
