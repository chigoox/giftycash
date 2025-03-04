


export const isDev = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return true
    } else {
        return false
    }
}

export const filterNullFromArray = (array) => {
    return array.filter(x => !!x)
}


export function setCSSVariables(variable, color) {
    const r = document.querySelector(':root');
    r.style.setProperty(variable, color);
}



export function handleInput5(key, value, stateSetter) {
    //const key = target.name
    // const value = target.value


    try {
        stateSetter((old) => {
            return { ...old, [key]: value }
        })
    } catch {
        if (!stateSetter) {
            console.log('need stateSetter')
        }
    }

}

export function disableScroll(enable = true, name = "scroll-able") {
    if (enable) document.querySelector(`.${name}`).classList.add('disablScroll');
    if (!enable) document.querySelector(`.${name}`).classList.remove('disablScroll');
    console.log(enable)
}

export const getRand = (max = 99999) => { return Math.floor(Math.random() * max) + 1; }

export function getRandTN(size = 7) {
    const result = Math.random().toString(36).substring(2, size < 7 ? 7 : size);
    return result;

}

export const filterObject = (obj, filterFunc) => {
    Object.filter = (obj, predicate) =>
        Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});

    var filtered = Object.filter(obj, filterFunc);
    return (filtered);

}

export function fileToBase64Url(file) {
    console.log(file.thumbUrl)
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // Convert result to Base64URL format
            const base64 = reader.result.split(',')[1]; // Remove the data URL prefix
            const base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            resolve(base64Url);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}


export function generateRandomUsername() {
    const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Lucky", "Witty", "Silent", "Loyal", "Bright", "Fierce"];
    const nouns = ["Eagle", "Tiger", "Wolf", "Bear", "Fox", "Dragon", "Hawk", "Lion", "Phoenix", "Shadow"];
    const numbers = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}${numbers}`;
}

    

export const createArray = (length) => {
    const newArray = Array.from({ length: length }, (value, index) => index)

    return newArray
}