# Alpaca

Alpaca is a dynamic survey builder tool powered by Gulp and Angular.

# How it works

1. Templates are minified and added to Angular's template cache
2. The alpaca-viewer directive is initialized from the index template
3. Inside the alpaca-viewer, alpaca-slide's are initialized with specified templates.
4. Each slide has access to alpaca-viewer scope

# Development

Hotpath consists of two single-page Angular 1.5 apps (viewer and editor), as well as static web pages.

## Install
   `npm install`

## Run
   `gulp`

## Angular Dependencies

[ng-flow](https://github.com/flowjs/ng-flow) - To support file upload and drag 'n drop images

[angular-content-editable](https://github.com/codekraft-studio/angular-content-editable) - To support inline text/html editing

[ng-sortable](https://github.com/a5hik/ng-sortable) - To support reordering content by dragging

#To Do
[ ] Add Tests
[ ] Add Linting
[ ] Abstract swiperRepeat
[ ] Toggle swiping
[ ] src and bin folders
[ ] Deploy to npm
[ ] Examples