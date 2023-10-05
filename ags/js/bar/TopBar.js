import OverviewButton from './buttons/OverviewButton.js';
import Workspaces from './buttons/Workspaces.js';
import FocusedClient from './buttons/FocusedClient.js';
import MediaIndicator from './buttons/MediaIndicator.js';
import DateButton from './buttons/DateButton.js';
import NotificationIndicator from './buttons/NotificationIndicator.js';
import SysTray from './buttons/SysTray.js';
import ColorPicker from './buttons/ColorPicker.js';
import SystemIndicators from './buttons/SystemIndicators.js';
import PowerMenu from './buttons/PowerMenu.js';
import Separator from '../misc/Separator.js';
import ScreenRecord from './buttons/ScreenRecord.js';
import BatteryBar from './buttons/BatteryBar.js';
import SubMenu from './buttons/SubMenu.js';
import { SystemTray, Widget, Variable } from '../imports.js';
import { Notifications, Mpris, Battery } from '../imports.js';
import Recorder from '../services/screenrecord.js';

import { Taskbar } from '../dock/Dock.js';
import WorkspacesHypr from './buttons/WorkspacesHypr.js';
import { UsageCPU, UsageDisk, UsageRAM } from './buttons/Usage.js';
import Screenshot from './buttons/Screenshot.js';
import Note from './buttons/Note.js';
import BluetoothDevices from './buttons/BluetoothDevice.js';
import { TemperatureIndicator } from './buttons/Weather.js';

const submenuItems = Variable(1);
SystemTray.connect('changed', () => {
    submenuItems.setValue(SystemTray.items.length + 1);
});

const SeparatorDot = (service, condition) => Separator({
    orientation: 'vertical',
    valign: 'center',
    connections: service && [[service, dot => {
        dot.visible = condition(service);
    }]],
});

const Start = () => Widget.Box({
    className: 'start',
    children: [
        OverviewButton(),
        SeparatorDot(),
        // Workspaces(),
        Taskbar([]),
        SeparatorDot(),
        WorkspacesHypr(),
        SeparatorDot(),
        // FocusedClient(),
        Widget.Box({ hexpand: true }),
        MediaIndicator({ direction: 'left' }),
        SeparatorDot(Mpris, m => m.players.length > 0),
    ],
});

const Center = () => Widget.Box({
    className: 'center',
    children: [
        DateButton({ format: '%a %b %e   %H:%M:%S' }),
        TemperatureIndicator(),
    ],
});

const End = () => Widget.Box({
    className: 'end',
    children: [
        SeparatorDot(Notifications, n => n.notifications.length > 0 || n.dnd),
        NotificationIndicator({ direction: 'right' }),
        Widget.Box({ hexpand: true }),

        UsageCPU(),
        UsageRAM(),
        UsageDisk(),
        BluetoothDevices(),
        SeparatorDot(),
        SysTray(),
        ColorPicker(),

        // SubMenu({
        //     items: submenuItems,
        //     children: [
        //         SysTray(),
        //         ColorPicker(),
        //     ],
        // }),

        SeparatorDot(),
        ScreenRecord(),
        SeparatorDot(Recorder, r => r.recording),
        Note(),
        Screenshot(),
        SeparatorDot(),
        SystemIndicators(),
        // SeparatorDot(Battery, b => b.available),
        // BatteryBar(),
        SeparatorDot(),
        PowerMenu(),
    ],
});

export default monitor => Widget.Window({
    name: `bar${monitor}`,
    exclusive: true,
    monitor,
    anchor: 'top left right',
    child: Widget.CenterBox({
        className: 'panel',
        startWidget: Start(),
        centerWidget: Center(),
        endWidget: End(),
    }),
});
