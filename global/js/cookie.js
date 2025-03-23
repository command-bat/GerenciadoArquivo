// cookieManager.js
function setUserCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Define a expiração
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/;`;
    console.log(`Cookie ${name} definido como: ${value}`);
}

function getUserCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [nameCK, valueCK] = cookie.split("=");
        if (nameCK === name) {
            return valueCK;
        }
    }
    return null; // Retorna null se o cookie não existir
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Exportando as funções para uso com require()
module.exports = { setUserCookie, getUserCookie, deleteCookie };
