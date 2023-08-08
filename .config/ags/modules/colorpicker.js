const { execAsync } = ags.Utils;
const { Widget } = ags;

Widget.widgets['colorpicker'] = props => Widget({
    child: {
        type: 'icon',
        icon: 'color-select-symbolic',
    },
    ...props,
    type: 'button',
    onClick: () => execAsync('hyprpicker -a -n').catch(print),
    onSecondaryClick: () => execAsync('hyprpicker -a').catch(print),
});
