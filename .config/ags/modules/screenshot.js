const { execAsync } = ags.Utils;
const { Widget } = ags;

Widget.widgets['screenshot'] = props => Widget({
    child: {
        type: 'icon',
        icon: 'applets-screenshooter-symbolic',
    },
    ...props,
    type: 'button',
    onClick: () => {
        execAsync(['bash', '-c', "~/.config/waybar/scripts/screenshot.sh 1"]).catch(print);
    },
    onSecondaryClick: () => {
        execAsync(['bash', '-c', "~/.config/waybar/scripts/screenshot.sh"]).catch(print);
    },
});
