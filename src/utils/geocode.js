const request = require('postman-request');

const geocode = (address, callback) => {
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(
        address
    )}.json?key=SOcEG1SQPafqVyA2va6U`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to Location service!', undefined);
        } else if (body.features.length === 0) {
            callback('Unable to find Location. Try another search.', undefined);
        } else {
            callback(undefined, {
                location: body.features[0].place_name,
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
            });
        }
    });
};

module.exports = geocode;
