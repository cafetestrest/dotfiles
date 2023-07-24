const { Widget } = ags;
const { Settings } = ags.Service;
const { exec, execAsync } = ags.Utils;

Widget.widgets['nightlight/toggle'] = props => Widget({
    ...props,
    type: 'button',
    hexpand: true,
    onClick: () => {
        Settings.nightlight = !Settings.nightlight
        if (Settings.nightlight) {
            execAsync(['bash', '-c', "wlsunset -t 3500 -S 06:00 -s 06:01"])
        } else {
            execAsync(['bash', '-c', "killall -9 wlsunset"])
        }
    },
    connections: [[Settings, button => {
        button.toggleClassName('on ', Settings.nightlight);
    }]],
});

Widget.widgets['nightlight/indicator'] = props => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: true, widget: { type: 'icon', icon: 'night-light-symbolic' } },
        { value: false, widget: { type: 'icon', icon: 'night-light-disabled-symbolic' } },
    ],
    connections: [[Settings, dynamic => {
        dynamic.update(value => {
            return value === Settings.nightlight
        });
    }]],
});
