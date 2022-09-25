const path = require('path');
const express = require('express');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');
const hbs = require('hbs');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.resolve(__dirname, '../public');
const viewsPath = path.resolve(__dirname, '../templates/views');
const partialPath = path.resolve(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Talaat Ramadan',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Talaat Ramadan',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'help',
        name: 'Talaat Ramadan',
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.status(404).send({
            error: 'You must provide an address',
        });
    }
    geocode(
        req.query.address,
        (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.status(404).send({ error });
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.status(404).send({ error });
                }

                res.status(200).send({
                    forecast: forecastData,
                    location,
                    address: req.query.address,
                });
            });
        }
    );
});

app.get('/help/*', (req, res) => {
    res.status(404).render('404', {
        title: '404',
        name: 'Talaat Ramadan',
        errorMessage: 'Help article not found',
    });
});

app.get('/*', (req, res) => {
    res.status(404).render('404', {
        title: '404',
        name: 'Talaat Ramadan',
        errorMessage: 'Page not Found',
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
