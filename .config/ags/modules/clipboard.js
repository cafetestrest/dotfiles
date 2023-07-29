const { execAsync } = ags.Utils;
const { Widget } = ags;

Widget.widgets['clipboard'] = props => Widget({
    child: {
        type: 'icon',
        icon: 'edit-paste-symbolic',
    },
    ...props,
    type: 'button',
    onClick: () => {
        execAsync(['bash', '-c', "hyprctl dispatch movecursor 3550 260 && hyprctl dispatch exec copyq menu"])
    },
    // onSecondaryClick: () => {
    //     execAsync(['bash', '-c', ""])
    // },
});
