import options from './options.js';
import { Variable, Utils } from './imports.js';

const prettyUptime = str => {
    if (str.length >= 4)
        return str;

    if (str.length === 1)
        return '0:0' + str;

    if (str.length === 2)
        return '0:' + str;
};

export const uptime = Variable(0, {
    poll: [60_000, 'uptime', line => prettyUptime(line.split(/\s+/)[2].replace(',', ''))],
});

export const distro = Utils.exec('cat /etc/os-release')
    .split('\n')
    .find(line => line.startsWith('ID'))
    .split('=')[1];

export const distroIcon = (() => {
    switch (distro) {
        case 'fedora': return '';
        case 'arch': return '';
        case 'nixos': return '';
        case 'debian': return '';
        case 'opensuse-tumbleweed': return '';
        case 'ubuntu': return '';
        case 'endeavouros': return '';
        default: return '';
    }
})();

const divide = ([total, free]) => free / total;
export const cpu = Variable(0, {
    poll: [options.systemFetchInterval, 'top -b -n 1', out => divide([100, out.split('\n')
        .find(line => line.includes('Cpu(s)'))
        .split(/\s+/)[1]
        .replace(',', '.')])],
});

export const ram = Variable(0, {
    poll: [options.systemFetchInterval, 'free', out => divide(out.split('\n')
        .find(line => line.includes('Mem:'))
        .split(/\s+/)
        .splice(1, 2))],
});

// export const temp = Variable(0, {
//     poll: [options.systemFetchInterval, 'cat ' + options.temperature, n => n / 100_000],
// });

export const ramGB = ags.Variable(0, {
    poll: [options.systemFetchInterval, "free --giga -h", out => out.split('\n')
        .find(line => line.includes('Mem:'))
        .split(/\s+/)
        .splice(2, 1)]
});

export const disk = ags.Variable(0, {
    poll: [600_000, "df -h /", out => {
        const lines = out.split('\n');
        if (lines.length >= 2) {
            return lines[1].split(/\s+/)[4].replace('%', '') / 100;
        }
        return -1;
    }]
});
