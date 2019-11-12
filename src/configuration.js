import {version} from '../package.json';

const configuration = {
    titleName: 'inside we cube Legend',
    dbName: 'cubeMaze',
    cubeName: 'cube',
    plateName: 'plate',
    levelName: 'level',
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

if (self.houseQuest === true) {
    Object.assign(configuration, {
        titleName: 'house quest',
        dbName: 'houseMaze',
        cubeName: 'village',
        plateName: 'house',
        levelName: 'floor',
        village: {
            sizeX: 3,
            sizeY: 3,
            sizeZ: 1,
            starts: ['-1, 5, 0', '-1, 6, 0', '5, -1, 0', '6, -1, 0', '5, 12, 0', '6, 12, 0'],
            ends: ['12, 5, 0', '12, 6, 0'],
        },
        house: {
            sizeX: 4,
            sizeY: 4,
        },
    });
}

export default configuration;
