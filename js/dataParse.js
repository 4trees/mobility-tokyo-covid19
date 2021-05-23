const Data_row = d3.csv('./data/aggregatedData_countries.csv', parseData);
const JData_row = d3.csv('./data/aggregatedData_japan.csv', parseData);
const summerData_row = d3.csv('./data/aggregatedData_summercities.csv', parseData);

const tipCountries = [
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Russia'
];
const tipJCities = [
    'Sapporo',
    'Yokohama',
    'Nagoya',
    'Kyoto',
    'Nara',
    'Osaka'
];
const tipOlyCities = [
    'London',
    'Athens',
    'Paris',
    'Los Angeles',
    'Stockholm',
];

const tipCities_dataname = d3.scaleOrdinal().domain(tipCountries.concat(tipJCities).concat(tipOlyCities)).range([
    ...tipCountries,
    'Hokkaido',
    'Kanagawa',
    'Aichi',
    'Kyoto',
    'Nara',
    'Osaka',
    ...tipOlyCities,
]);


const TYPES = [
    'retail_and_recreation_percent_change_from_baseline',
    'grocery_and_pharmacy_percent_change_from_baseline',
    'residential_percent_change_from_baseline',
    'transit_stations_percent_change_from_baseline',
    'workplaces_percent_change_from_baseline',
    'parks_percent_change_from_baseline',
]
const TYPES_label = d3.scaleOrdinal().domain(TYPES).range([
    'Retail & recreation',
    'Grocery & pharmacy',
    'Residential',
    'Transit stations',
    'Workplaces',
    'Parks'

]);

function parseData(d, i) {

    TYPES.forEach(n => {
        d[n] = +d[n];
    });

    return d;
};