### Templates

A Template describes how a Slide should render.

#### Example
*sample.pug*

```pug
    .container
        .card.medium.green
            h1 {{slide.title}}
            h2 {{slide.content}}
```

#### The *index* Template
**Required:** There must be a Template named *index*. This is used for the root view of the presentation. This template **must** contain the `alpaca-slides` directive. This directive marks where the slides will be rendered. The index template is useful for adding a header and footer.

#### Adding a Template
Add a pug/html template to */viewer/templates*

#### Compilation
Templates are compiled automatically. The output is an `alpaca-templates` module. This module is a dependency for the viewer. It populates Angular's `$templateCache`. It also includes a `$templateList` service, which contains an array of all the template names.

#### Usage
Each Slide must specify a root property of *template* that maps to an existing template.


