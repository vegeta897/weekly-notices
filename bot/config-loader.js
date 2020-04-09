const Ajv = require('ajv');
const loadJsonFile = require('load-json-file');
const moment = require('moment-timezone');

module.exports = {
    load: async (schemaPath, dataPath) => {
        let data = await loadJsonFile(dataPath);
        let schema = await loadJsonFile(schemaPath);
        let ajv = new Ajv({
            verbose: true,
            useDefaults: true
        });
        ajv.addFormat('IANATimeZone', timezone => moment().tz(timezone)._isUTC);
        let validSchedule = ajv.validate(schema, data);
        if(!validSchedule) {
            let errorMessages = ajv.errors.map(error => {
                return `${error.dataPath} value '${error.data}' ${error.message} - ${error.schema}`
            });
            throw new Error(JSON.stringify(errorMessages));
        }
        return data;
    }
};
