import {version} from '../package.json';

const configuration = {
    version: version,
    village: {
        sizeX: 1,
        sizeY: 1,
        sizeZ: 2,
        starts: ['0, 0, 0'],
        ends: ['13, 8, 0'],
    },
    house: {
        sizeX: 14,
        sizeY: 9,
    },
};

export default configuration;
