const { Widget } = ags;
const { Settings } = ags.Service;
const { exec, execAsync } = ags.Utils;

Widget.widgets['swayidle/toggle'] = props => Widget({
    ...props,
    type: 'button',
    hexpand: true,
    onClick: () => {
        execAsync(['bash', '-c', "~/.config/hypr/scripts/swayidle.sh toggle"])

        Settings.swayidle = !Settings.swayidle
        
        // if (Settings.swayidle) {
        // } else {
            // execAsync(['bash', '-c', "killall -9 wlsunset"])
        // }

    },
    connections: [[Settings, button => {
        button.toggleClassName('on ', Settings.swayidle);
    }]],
});

Widget.widgets['swayidle/indicator'] = props => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: false, widget: { type: 'icon', icon: 'view-reveal-symbolic' } },
        { value: true, widget: { type: 'icon', icon: 'view-conceal-symbolic' } },
    ],
    connections: [[Settings, dynamic => {
        dynamic.update(value => {
            return value === Settings.swayidle
        });
    }]],
});
