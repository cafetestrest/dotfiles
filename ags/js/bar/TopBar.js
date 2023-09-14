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
const { Window, CenterBox, Box } = ags.Widget;
const { SystemTray } = ags.Service;
import { Taskbar } from '../dock/Dock.js';
import Screenshot from './buttons/Screenshot.js';
import Note from './buttons/Note.js';
import { UsageCPU, UsageDisk, UsageRAM } from './buttons/Usage.js';
// import BluetoothDevices from './buttons/BluetoothDevices.js';
import { TemperatureIndicator } from './buttons/Weather.js';
import BluetoothDevice from './buttons/BluetoothDevice.js';
import WorkspacesHypr from './buttons/WorkspacesHypr.js';

const submenuItems = ags.Variable(1);
SystemTray.instance.connect('changed', () => {
    submenuItems.setValue(SystemTray.items.length + 1);
});

const SeparatorDot = (service, condition) => Separator({
    orientation: 'vertical',
    valign: 'center',
    connections: service && [[ags.Service[service], dot => {
        dot.visible = condition(ags.Service[service]);
    }]],
});

const Start = () => Box({
    className: 'start',
    children: [
        OverviewButton(),
        SeparatorDot(),
        // Workspaces(),
        Taskbar(),
        SeparatorDot(),
        WorkspacesHypr(),
        SeparatorDot(),
        // FocusedClient(),
        Box({ hexpand: true }),
        SeparatorDot('Mpris', m => m.players.length > 0),
        MediaIndicator({ direction: 'left' }),
        NotificationIndicator(),
    ],
});

const Center = () => Box({
    className: 'center',
    children: [
        DateButton({ format: '%a %b %e   %H:%M:%S' }),
        TemperatureIndicator(),
    ],
});

const End = () => Box({
    className: 'end',
    children: [
        NotificationIndicator({ direction: 'right' }),
        SeparatorDot('Notifications', n => n.notifications.length > 0 || n.dnd),
        Box({ hexpand: true }),
        UsageCPU(),
        UsageRAM(),
        UsageDisk(),
        BluetoothDevice(),
        // BluetoothDevices(),
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
        SeparatorDot('Recorder', r => r.recording),
        // BatteryBar(),
        // SeparatorDot('Battery', b => b.available),
        Note(),
        Screenshot(),
        SeparatorDot(),
        SystemIndicators(),
        SeparatorDot(),
        PowerMenu(),
    ],
});

export default monitor => Window({
    name: `bar${monitor}`,
    exclusive: true,
    monitor,
    anchor: 'top left right',
    child: CenterBox({
        className: 'panel',
        startWidget: Start(),
        centerWidget: Center(),
        endWidget: End(),
    }),
});
