const viewport = (framework) => {

    /**
     * This objects gets used to create the dummy elements which are used
     * to detecht the breakpoints.
     * 
     * @type {Object}
     */
    let detectionDivs = {
        bootstrap: {
            'xs': 'device-xs d-block d-sm-none',
            'sm': 'device-sm d-none d-sm-block d-md-none',
            'md': 'device-md d-none d-md-block d-lg-none',
            'lg': 'device-lg d-none d-lg-block d-xl-none',
            'xl': 'device-xl d-none d-xl-block',
        },
    };

    /**
     * Creates the dummy elements and appends them to the end of the document
     * body.
     * 
     * @param  {Object} breakpoints The description of the elements of a certain framework (see detectionDivs above)
     * @return {Array}              Array with references to the newly created elements
     */
    const insertDetectionDivs = (breakpoints) => {
        let elements = [];

        for (let key in breakpoints) {
            if (breakpoints.hasOwnProperty(key)) {
                let el = document.createElement('div');
                el.className = breakpoints[key];
                document.body.appendChild(el);

                elements.push(el);
            }
        }

        return elements;
    }

    /**
     * Splits the expression in into <|> [=] alias
     *
     * @type {String} str   The expression
     */
    const splitExpression = (str) => {

        let operator = str.charAt(0);
        let orEqual  = (str.charAt(1) == '=') ? true : false;

        /**
         * Index at which breakpoint name starts.
         */
        let index = 1 + (orEqual ? 1 : 0);

        /**
         * The remaining part of the expression, after the operator, will be treated as the
         * breakpoint name to compare with
         */
        let breakpointName = str.slice(index);

        return {
            operator: operator,
            orEqual: orEqual,
            breakpointName: breakpointName
        };
    }

    /**
     * Checks array of elements for visibility. Because only one element is visible at a time at 
     * any breakpoint, the loop breaks when it has found a visible element and returns the index
     * of that element. Because we start at the smallest breakpoint element we don't need to check
     * all breakpoints. getComputedStyle() is quite slow so this is a perfomance boost, and mobile 
     * benefits the most because we start at the smallest element.
     * 
     * @param  {Array} divs     Array with references to the detection elements
     * @return {Number}         Returns the index of the visible element
     */
    const checkDivsForVisibility = (divs) => {
        let count = 0;

        for (let key in divs) {
            if (divs.hasOwnProperty(key)) {
                let v = divs[key].currentStyle ? divs[key].currentStyle.display : getComputedStyle(divs[key], null).display;
            
                if (v === 'block') {
                    break;
                }

                count++;
            }
        }

        return count;
    }

    /**
     * Checks if an expression like ">=sm" holds true for the current breakpoints
     * 
     * @param  {String} expressionStr     Expression string like "<md" or ">=sm"
     * @param  {Array}  breakpoints       List of the breakpoints (only their names)
     * @param  {Number} currentBreakpoint Index of the current breakpoint
     * @return {Boolean}                  
     */
    const isMatchingExpression = (expressionStr, breakpoints, currentBreakpoint) => {
        let expression = splitExpression(expressionStr);
        let requestedBreakpoint = breakpoints.indexOf(expression.breakpointName);

        switch(expression.operator) {
            case '>': 
                if (!expression.orEqual) {
                    requestedBreakpoint++;
                }
                
                return (currentBreakpoint > requestedBreakpoint) ? true : false;
            case '<':
                if (!expression.orEqual) {
                    requestedBreakpoint--;
                }

                return (currentBreakpoint < requestedBreakpoint) ? true : false;
            case '=':
                return (currentBreakpoint === requestedBreakpoint) ? true : false;
            default: 
                break;
        }
    }

    /**
     * Public methods 
     * 
     * @type {Object}
     */
    let self = {
        divs: null,
        breakpoints: null,
        currentBreakpoint: null,

        /**
         * Initilizes the plugin with a framework
         * 
         * @param  {String} framework Framework name. 
         * @return {void}
         */
        init: (framework) => {
            if (typeof detectionDivs[framework] === 'undefined') {
                console.error("Framework not recognized. Use 'boostrap'.");
                return;
            }

            self.breakpoints = Object.keys(detectionDivs[framework]);
            self.divs = insertDetectionDivs(detectionDivs[framework]);
        },

        /**
         * Checks if an expression holds true. Used the stored self.currentBreakpoint
         * variable to save resources, so fails if this is still null. Use this function 
         * inside the callback from the 'changed' method and you're fine!
         * 
         * @param  {String} expression Expression string, like ">sm"
         * @return {Boolean}           
         */
        is: (expression) => {
            if (self.currentBreakpoint === null) {
                console.error('Call viewport.changed() first to update the current breakpoint');
            }
            return isMatchingExpression(expression, self.breakpoints, self.currentBreakpoint);
        },

        /**
         * Checks the current breakpoint fires a callback only once it changes
         * 
         * @param  {Function} callback Callback function
         * @return {void}          
         */
        changed: (callback) => {
            let c = checkDivsForVisibility(self.divs);

            if (self.currentBreakpoint !== c) {
                self.currentBreakpoint = c;
                callback();
            }
        },
    };

    return self;
}

export default viewport();