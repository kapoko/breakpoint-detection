const viewport = (framework) => {

    let detectionDivs = {
        bootstrap: {
            'xs': 'device-xs d-block d-sm-none',
            'sm': 'device-sm d-none d-sm-block d-md-none',
            'md': 'device-md d-none d-md-block d-lg-none',
            'lg': 'device-lg d-none d-lg-block d-xl-none',
            'xl': 'device-xl d-none d-xl-block',
        },
    };

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
     */
    const splitExpression = (str) => {

        // Used operator
        let operator = str.charAt(0);

        // Include breakpoint equal to alias?
        let orEqual  = (str.charAt(1) == '=') ? true : false;

        /**
         * Index at which breakpoint name starts.
         *
         * For:  >sm, index = 1
         * For: >=sm, index = 2
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

    let self = {
        divs: null,
        breakpoints: null,
        currentBreakpoint: null,

        init: (framework) => {
            if (typeof detectionDivs[framework] === 'undefined') {
                console.error("Framework not recognized. Use 'boostrap'.");
                return;
            }

            self.breakpoints = Object.keys(detectionDivs[framework]);
            self.divs = insertDetectionDivs(detectionDivs[framework]);
        },

        is: (expression) => {
            if (self.currentBreakpoint === null) {
                console.error('Call viewport.changed() first to update the current breakpoint');
            }
            return isMatchingExpression(expression, self.breakpoints, self.currentBreakpoint);
        },

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