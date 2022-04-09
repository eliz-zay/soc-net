import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';

import { assert } from '../core';

async function run() {
    const response = await axios.get(`https://api.hh.ru/areas`);

    const data = response.data;

    data.splice(6, 1);

    const russianGeoRaw = data[0];

    let idCounter = 1;

    const countries = [];
    const regions = [];
    const cities = [];

    countries.push({ id: idCounter, name: 'Россия', parentId: null, range: 'country' });

    idCounter++;

    const leafRegions = [];

    for (const regionRaw of russianGeoRaw.areas) {
        if (regionRaw.areas.length) {
            regions.push({ id: idCounter, name: regionRaw.name, parentId: countries[0].id, range: 'region' });

            idCounter++;
        } else {
            leafRegions.push(regionRaw);
        }
    }

    /**
     * На данный момент 2 региона без городов - Москва, Санкт-Петербург
     */

    assert(leafRegions.length === 2, 'Leaf regions length must be equal 2');

    russianGeoRaw.areas = russianGeoRaw.areas.filter((region: any) => region.name !== 'Москва' && region.name !== 'Санкт-петербург');

    for (let i = 0; i < regions.length; i++) {
        if (!russianGeoRaw.areas[i].areas.length) {
            continue;
        }

        if (regions[i].name === 'Московская область') {
            cities.push({ id: idCounter, name: 'Москва', parentId: regions[i].id, range: 'city' });

            idCounter++;
        }

        if (regions[i].name === 'Ленинградская область') {
            cities.push({ id: idCounter, name: 'Санкт-петербург', parentId: regions[i].id, range: 'city' });

            idCounter++;
        }

        for (const city of russianGeoRaw.areas[i].areas) {
            cities.push({ id: idCounter, name: city.name, parentId: regions[i].id, range: 'city' });

            idCounter++;
        }
    }

    await fsp.writeFile(path.join(__dirname, 'geo.json'), JSON.stringify({ countries, regions, cities }));
}

run();
