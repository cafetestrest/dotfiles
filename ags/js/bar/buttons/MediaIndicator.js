import HoverRevealer from '../../misc/HoverRevealer.js';
import * as mpris from '../../misc/mpris.js';
import options from '../../options.js';
import { Widget, Mpris, Utils } from '../../imports.js';

export const getPlayer = (name = options.preferredMpris) =>
    Mpris.getPlayer(name) || Mpris.players[0] || null;

const Indicator = ({ player, direction = 'right' } = {}) => HoverRevealer({
    className: `media panel-button ${player.name}`,
    direction,
    onPrimaryClick: () => player.playPause(),
    onScrollUp: () => player.next(),
    onScrollDown: () => player.previous(),
    onSecondaryClick: () => player.playPause(),
    indicator: mpris.PlayerIcon(player),
    child: Widget.Label({
        vexpand: true,
        truncate: 'end',
        maxWidthChars: 40,
        connections: [[player, label => {
            label.label = `${player.trackArtists.join(', ')}   ${player.trackTitle}   `;
        }]],
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

        if (revealer._current === truncateString(player.trackTitle, 50))
            return;

        // revealer._current = player.trackTitle;
        revealer._current = truncateString(player.trackTitle, 50);
        revealer.revealChild = true;
        Utils.timeout(3000, () => {
            revealer.revealChild = false;
        });
    }]],
});

export default ({ direction } = {}) => Widget.Box({
    className: 'media-player',
    connections: [[Mpris, box => {
        const player = getPlayer();
        box.visible = !!player;

        if (player && player.position && player.position === -1) {
            box.visible = false;
            return;
        }

        if (!player) {
            box._player = null;
            return;
        }

        if (box._player === player)
            return;

        box._player = player;
        box.children = [Indicator({ player, direction })];
    }, 'notify::players']],//todo other buttons prev/next
});
