const parseParam = function(_routeDefinition, _route, _rdIndex, _rIndex) {
    if(_routeDefinition[_rdIndex] !== '{') {
        return null; // bad input
    }

    let paramName = '';
    let validParamName = false;
    let endingRDChar = null;
    let endingRDIndex = _rdIndex;
    for(let i=_rdIndex+1; i<_routeDefinition.length ;i++) {
        if(_routeDefinition[i] === '}') {
            validParamName = true;
            endingRDIndex = i + 1;

            if(i+1 <= _routeDefinition.length) {
                endingRDChar = _routeDefinition[i+1];
            }

            break;
        }

        paramName += _routeDefinition[i];
    }

    if(!validParamName) {
        return null;
    }

    let paramValue = "";
    let endingRIndex = _rIndex;
    for(let i=_rIndex;;i++) {

        if(i >= _route.length || _route[i] === '?' || _route[i] === '/' || _route[i] === endingRDChar) {
            endingRIndex = i;
            break;
        }

        paramValue += _route[i];
    }

    return {
        "paramName": paramName,
        "paramValue": paramValue,
        "endingRDIndex": endingRDIndex,
        "endingRIndex": endingRIndex
    };

};

const parseAndMatch = function(_routeDefinition, _route) {

    const paramValueMap = new Map();
    let rdIndex = 0;
    let rIndex = 0;
    let matchFound = true;

    while(true) {

        if(rdIndex >= _routeDefinition.length) {
            break;
        }

        if(_routeDefinition[rdIndex] === '{') {
            const p = parseParam(_routeDefinition, _route, rdIndex, rIndex);
            if(p ===  null) {
                break;
            }

            rdIndex = p.endingRDIndex;
            rIndex = p.endingRIndex;

            paramValueMap.set(p.paramName, p.paramValue);
            continue;
        }


        if(rIndex >= _routeDefinition.length) { // note we always want to process route def. before checking if at end of route string
            break;
        }

        if(_routeDefinition[rdIndex] === _route[rIndex]) {
            rIndex++;
            rdIndex++;
        } else {
            matchFound = false;
            break;
        }
        
    }


    return {
        "matchFound": matchFound,
        "paramValueMap": paramValueMap
    }

};
