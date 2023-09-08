import HoverRevealer from '../../misc/HoverRevealer.js';
import * as mpris from '../../misc/mpris.js';
const { Box, Label } = ags.Widget;
const { Mpris } = ags.Service;

const Indicator = ({ player, direction = 'right' } = {}) => Box({
    className: `media panel-button ${player.name}`,
    children: [
        mpris.PreviousButton(player),
        HoverRevealer({
        direction,
        onPrimaryClick: () => player.playPause(),
        onScrollUp: () => player.next(),
        onScrollDown: () => player.previous(),
        onSecondaryClick: () => player.playPause(),
        indicator: mpris.PlayerIcon(player),
        child: Box({
            children: [
                mpris.ArtistLabel(player),
                Label('   '),
                mpris.TitleLabel(player),
                Label('   '),
            ],
        }),
        connections: [[player, revealer => {
            if (revealer._current === player.trackTitle)
                return;

            function truncateString(inputString, maxLength) {
                if (!inputString) {
                    return '';
                }

                if (inputString.length > maxLength) {
                    return inputString.slice(0, maxLength);
                } else {
                    return inputString;
                }
            }

            if (revealer._current === truncateString(mpris.trackTitle, 50))
                return;

            // revealer._current = player.trackTitle;
            revealer._current = truncateString(mpris.trackTitle, 50);
            revealer.revealChild = true;
            ags.Utils.timeout(3000, () => {
                revealer.revealChild = false;
            });
        }]],
    }),
    mpris.NextButton(player),
    ],
});

export default ({ direction } = {}) => Box({
    connections: [[Mpris, box => {
        const player = Mpris.getPlayer(mpris.prefer);
        if (!player) {
            box._player = null;
            return;
        }
        if (box._player === player)
            return;

        box.visible = true;
        box._player = player;
        box.children = [Indicator({ player, direction })];
    }]],
});
