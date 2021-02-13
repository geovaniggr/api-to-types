import fs from 'fs'
import axios from 'axios'
import mock from './mock.js'
import main from './index.js'

const init = async (name = "Default", endpoint) => {
    const file = fs.createWriteStream(`./types/${name}.ts`, { flags: 'a' })
    let json;

    if(endpoint){
        const response = await axios.get(endpoint);
        const parsed = await response.data;

        json = Array.isArray(parsed) ? parsed[0] : parsed;

    } else {
        json = mock;
    }

    main(name, file, json)
}

const [name, endpoint] = process.argv.slice(2);

init(name, endpoint)