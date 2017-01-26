### Schemas

A Schema is a json file that describes what properties belong to all slides of a template.

#### Example
*sample.json*

    [
        {
            "key": "title",
            "type": "input"
        },
        {
            "key": "content",
            "type": "textarea"
        }
    ]

#### Structure
A Schema consists of an array of *fields* that will be rendered on the editor form. Each schema field must contain a `key`, which maps to the model property with the same name. It must also contain a `type`, which is covered in the next section.

#### Adding a Schema
In order to build, Schemas must be mapped 1-to-1 with a Template. To add a Schema, simply create a json file in */editor/schemas* with the same base file name as the corresponding Template in */viewer/templates*

#### Compilation

Schemas are automatically compiled by default. The result of the compile task is a `alpaca-schemas` module. This module is a dependency of the editor. It includes a `$schemas` service, which contains the data.

#### Usage

Include the `alpaca-schemas` javascript that corresponds to the `alpaca-templates` module used. **It is important that the Schema and Template module come from the same build**