import TopBar from './js/bar/TopBar.js';
// import ScreenCorners from './js/screencorner/ScreenCorners.js';
// import Overview from './js/overview/Overview.js';
import Dashboard from './js/dashboard/Dashboard.js';
import OSD from './js/osd/OSD.js';
// import FloatingDock from './js/dock/FloatingDock.js';
// import Applauncher from './js/applauncher/Applauncher.js';
import PowerMenu from './js/powermenu/PowerMenu.js';
// import Verification from './js/powermenu/Verification.js';
// import Desktop from './js/desktop/Desktop.js';
import Notifications from './js/notifications/Notifications.js';
import QuickSettings from './js/quicksettings/QuickSettings.js';
// import { warnOnLowBattery } from './js/utils.js';
import QSNotifications from './js/dashboard/Notifications.js';
import Weather from './js/dashboard/Weather.js';
const ws = ags.Service.Hyprland.HyprctlGet('monitors');
const forMonitors = widget => ws.map(mon => widget(mon.id));

// warnOnLowBattery();

export default {
    maxStreamVolume: 1.05,
    closeWindowDelay: {
        'quicksettings': 300,
        'dashboard': 300,
    },
    windows: [
        forMonitors(TopBar),
        // forMonitors(ScreenCorners),
        forMonitors(OSD),
        // forMonitors(FloatingDock),
        // forMonitors(Desktop),
        forMonitors(Notifications),
        // Applauncher(),
        // Overview(),
        Dashboard(),
        Weather(),
        QSNotifications(),
        QuickSettings(),
        PowerMenu(),
        // Verification(),
    ].flat(2),
};
