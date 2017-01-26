### Types

Types are templates that tell property fields how to render in the editor form.

#### Example
*input.pug*

    input(ng-model='model')

#### Adding a Type
Add a pug/html template to */editor/types*

#### Compilation
Types are compiled automatically. The output is an `alpaca-types` module, which is a dependency of the editor.

#### Usage
Each field in a Schema must specify a root property of *type* that maps to a Type.