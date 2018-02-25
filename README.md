# breakpoint-detection 💔

[![npm version](https://img.shields.io/npm/v/breakpoint-detection.svg)](https://www.npmjs.com/package/breakpoint-detection)

Pure Javascript breakpoint detection for Bootstrap 4.

Heavily inpsired on [Maciej Gurban's Responsive Bootstrap Toolkit](https://github.com/maciej-gurban/responsive-bootstrap-toolkit), even uses some of the same code, but I needed a version without jQuery dependency. 

## How is this different?

1. No jQuery dependency. I use Bootstrap without the javascript side of it, which depends on jQuery. As such, Maciej Gurban's Responsive Bootstrap Toolkit depends on jQuery itself. I needed a version without that dependency. 
2. It is a stripped down version. It has no EventListeners for example, which gives you more control, but also means you have to take care of it yourself (calling the plugin, debouncing the calls). 
3. It has some of the same methods as the above mentioned plugin, like `is` and `changed`. Only `changed` checks the inserted dummy divs for visibility, and `is` uses the stored result of `changed`. Because checking the divs for visibility is the most resource heavy action, `is` is much more lightweight. As a result though, we have to use `is` inside the callback function from `changed` (see 'Usage'), so we're sure the visibility has been checked.
4. Checking the dummy divs for visibility starts at the smallest breakpoint. Because only one element is visible at a time at any breakpoint, the loop breaks, giving a little performance boost which mobile benefits the most from. 

## Usage

Example in ES6 as I use it this way but it should work with common js as well. Using a [debounce function](https://davidwalsh.name/javascript-debounce-function) is **highly** recommended, you don't want to call the `changed` method too often. The example uses the one from [lodash](https://github.com/lodash/lodash), with a debounce time of 250 milliseconds.

```javascript
import viewport from 'breakpoint-detection';
import { debounce } from 'lodash';

document.addEventListener("DOMContentLoaded", () => {

    // Initialize with framework name. Only supports bootstrap for now.
    viewport.init('bootstrap');

    window.addEventListener('resize', debounce(() => {

        viewport.changed(() => {

            // Only gets called when the breakpoint changes
            if (viewport.is('<=sm')) {
                // Do mobile stuff
            } else {
                // Do other stuff
            }
        });

    }, 250);

});

```

## Copyright and license

Aw yiss, code released under [MIT License](https://github.com/kapoko/breakpoint-detection/blob/master/LICENSE). Have at it 🤘.
