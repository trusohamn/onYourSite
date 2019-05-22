const assert = require('assert');
const code = require('./index.js');

var minify = require('html-minifier').minify;

const rawData = {
    _id: 1,
    styles: 'red.css',
    text_1: 'first',
    text_2: 'second',
    class_3: 'bold',
    class_1: 'header',
    class_2: 'normal',
    image_position_4: 'top',
    text_3: 'third',
    image_url_4: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg'
}

const rawSortedData = {
    _id: 1,
    text_1: 'first',
    class_1: 'header',
    text_2: 'second',
    class_2: 'normal',
    text_3: 'third',
    class_3: 'bold',
    image_url_4: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg',
    image_position_4: 'top',
    styles: 'red.css'
}

const objectData = {
    _id: 1,
    styles: 'red.css',
    divs: [
        {
            text: 'first',
            classN: 'header'
        },
        {
            text: 'second',
            classN: 'normal'
        },
        {
            text: 'third',
            classN: 'bold'
        },
        {
            url: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg',
            position: 'top'
        }
    ]

};
const personalHtml =
    `<!DOCTYPE html>
     <html>
     <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>On Your Site</title>
        <link rel="stylesheet" href=red.css>
    </head>    
    <body>
        <div class=header>first</div>
        <div class=normal>second</div>
        <div class=bold>third</div>
        <img src=https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg alt="Your image">
    </body>
</html> 
`
describe('function sortData', () => {
    it('sorts data accordingly to the index number on the last position', () => {
        assert.deepEqual(rawSortedData, code.sortData(rawData));
    });
});

describe('function generateData', () => {
    it('parses data', () => {
        assert.deepEqual(objectData, code.generateData(rawSortedData));
    });
});

describe('function generatePersonalPage', () => {
    it('generates personal page html from data object in the order speficied in array', () => {
        assert.deepEqual(minify(personalHtml, { collapseWhitespace: true }),
            minify(code.generatePersonalPage(objectData), { collapseWhitespace: true }));
    });
});
