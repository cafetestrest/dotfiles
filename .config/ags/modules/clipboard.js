const { execAsync } = ags.Utils;
const { Button, Icon } = ags.Widget;

export const Clipboard = props => Button({
    ...props,
    child: Icon({
        icon: 'edit-paste-symbolic',
    }),
    onClicked: () => {
        execAsync(['bash', '-c', "hyprctl dispatch movecursor 3550 260 && hyprctl dispatch exec copyq menu"]).catch(print);
    },
    // onSecondaryClick: () => {
    //     execAsync(['bash', '-c', ""]).catch(print);
    // },
});
