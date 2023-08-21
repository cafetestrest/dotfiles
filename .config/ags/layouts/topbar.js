import * as shared from './shared.js';
// import { Workspaces, Client } from './widgets/hyprland.js';
import { WorkspacesCustom } from '../modules/workspaces.js';
import { Separator, SeparatorInvisible } from '../modules/misc.js';
import { PanelIndicator as MediaIndicator } from './widgets/media.js';
// import { PanelIndicator as NotificationIndicator } from './widgets/notifications.js';
import { DistroIcon } from '../modules/misc.js';
import { PanelButton as ColorPicker } from '../modules/colorpicker.js';
import { PanelButton as PowerMenu } from './widgets/powermenu.js';
import { PanelButton as DashBoard, NotificationsPanelButton } from './widgets/dashboard.js';
import { Taskbar } from '../modules/hyprland.js';
import { UsageCpuWidget, UsageRAMWidget, UsageDiskWidget } from '../modules/usage.js';
import { PanelButton as ScreenRecord } from '../modules/screenrecord.js';
import { PanelButton as QuickSettings } from './widgets/quicksettings.js';
import { BluetoothIndicatorWithBattery } from '../modules/bluetooth.js';
import { NoteWidget } from '../modules/note.js';
import { Screeenshot } from '../modules/screenshot.js';
import { Clipboard } from '../modules/clipboard.js';
import { TemperatureWidget } from '../modules/weather.js';

const Bar = monitor => shared.Bar({
    anchor: 'top left right',
    monitor,
    start: [
        shared.Launcher({ child: DistroIcon() }),
        SeparatorInvisible({ valign: 'center' }),
        // Workspaces(),
        Taskbar({ className: 'taskbar', }),
        WorkspacesCustom(),
        // SeparatorInvisible({ valign: 'center' }),
        // Client(),
        MediaIndicator({ hexpand: true, halign: 'end' }),
    ],
    center: [
        DashBoard({ format: '%a %b %e   %H:%M:%S' }),
        TemperatureWidget(),
        NotificationsPanelButton(),
    ],
    end: [
        // NotificationIndicator({ direction: 'right', hexpand: true, halign: 'start' }),
        ags.Widget.Box({ hexpand: true }),
        UsageRAMWidget(),
        UsageCpuWidget(),
        UsageDiskWidget(),
        BluetoothIndicatorWithBattery({ className: 'btdevices panel-button' }),
        SeparatorInvisible({ valign: 'center' }),
        ScreenRecord(),
        ColorPicker(),
        NoteWidget({ className: 'note panel-button' }),
        Screeenshot({ className: 'note panel-button' }),
        Clipboard({ className: 'note panel-button' }),
        SeparatorInvisible({ valign: 'center' }),
        QuickSettings(),
        SeparatorInvisible({ valign: 'center' }),
        PowerMenu(),
    ],
});

export default monitors => ([
    ...monitors.map(mon => [
        Bar(mon),
        shared.Notifications(mon, 'slide_down', 'top'),
        // shared.Desktop(mon),
        ...shared.Corners(mon),
        shared.OSDIndicator(mon),
        // shared.Dock(mon),
    ]),
    shared.Quicksettings({ position: 'top right' }),
    shared.Dashboard({ position: 'top' }),
    shared.NotificationsPopup({ position: 'top' }),
    shared.Weather({ position: 'top' }),
]).flat(2);
