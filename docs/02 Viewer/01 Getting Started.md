### Getting Started

1. Include the following scripts:
    - angular 1.5.X
    - alpaca-templates.js
    - alpaca-viewer.min.js
2. Include the `alpaca-viewer` module as a dependency in your app

        var app = angular.module('app', ['alpacaViewer'])

3. Add the `alpaca-viewer` directive to the html

        <alpaca-viewer survey='survey' />

#### Notes
* Templates are kept in a separate module to allow for third-party template modules
* The viewer will take the full size of its container