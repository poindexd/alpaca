### Getting Started

1. Include the following scripts:
    - angular 1.5.X
    - alpaca-templates.js
    - alpaca-types.js
    - alpaca-schemas.js
    - alpaca-editor.min.js
2. Include the `alpaca-editor` module as a dependency

        var app = angular.module('app', ['alpacaEditor'])

3. Add the `alpaca-form` directive to html

        <alpaca-form slide='slide'></alpaca-form>

4. Add the preview to html

        <wrap-in-frame>
            <device-preview device='device'>
                <alpaca-viewer slide='slide' />
            </device-preview>
        </wrap-in-frame>
