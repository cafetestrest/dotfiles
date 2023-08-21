const { execAsync } = ags.Utils;
const { Button, Icon } = ags.Widget;

export const Screeenshot = props => Button({
    ...props,
    child: Icon({
        icon: 'applets-screenshooter-symbolic',
    }),
    onClicked: () => {
        execAsync(['bash', '-c', "~/.config/waybar/scripts/screenshot.sh 1"]).catch(print);
    },
    onSecondaryClick: () => {
        execAsync(['bash', '-c', "~/.config/waybar/scripts/screenshot.sh"]).catch(print);
    },
});
