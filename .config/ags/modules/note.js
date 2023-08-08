const { exec, execAsync } = ags.Utils;
const { Widget } = ags;

Widget.widgets['note'] = props => Widget({
    child: {
        type: 'font-icon',
        icon: '',
    },
    ...props,
    type: 'button',
    tooltip: exec('cat /home/bajic/Documents/note'), //todo handle this one in nixos
    onClick: () => {
        execAsync(['bash', '-c', "codium ~/Documents/note"]).catch(print);
    },
    // onSecondaryClick: () => {
    //     execAsync(['bash', '-c', ""]).catch(print);
    // },
});
