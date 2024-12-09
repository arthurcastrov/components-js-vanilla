function isSignin() {
    pattern = /^\d{2}\/\d/;
    return b['cp.avalId'] !== undefined && pattern.test(b['cp.avalId'])
}

function checkRules() {
    return document.querySelector('preference-survey') === null &&  location.pathname === '/'
}

if(isSignin()
    && checkRules()
    && utag.loader.RC("utag_preferences").showComponent === undefined)  {
        document.body.innerHTML += '<preference-survey></preference-survey>';
}