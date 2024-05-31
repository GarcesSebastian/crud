let formSignIn = document.querySelector("#formSignIn");

formSignIn?.addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = new FormData(formSignIn);
    let data = {
        email: formData.get("email"),
        password: formData.get("password")
    }

    let response = await fetch("http://localhost:4000/login/auth", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    let result = await response.json();

    if (!response.ok) {
        alert(result.message);
        return;
    }

    setCookie("ID-USER", result.id);
    window.location.href = "/";
});

//now register with endpoint /register/auth that received the variables, username, email and password
let formSignUp = document.querySelector("#formSignUp");

formSignUp?.addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = new FormData(formSignUp);
    let data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password")
    }

    let response = await fetch("http://localhost:4000/register/auth", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    let result = await response.json();

    if (!response.ok) {
        alert(result.message);
        return;
    }

    window.location.href = "/SignIn";
});


export function setCookie(cookieName, cookieValue) {
    const expirationDate = new Date('9999-12-31'); // Establecer la fecha de vencimiento en el año 9999
    document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
}

export function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
}

export function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}