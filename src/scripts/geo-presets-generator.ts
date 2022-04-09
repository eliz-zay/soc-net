import axios from 'axios';

async function run() {
    const response = await axios.get(`https://api.hh.ru/areas`);

    const data = response.data;

    data.splice(6, 1);

    console.log(data);
}

run();
