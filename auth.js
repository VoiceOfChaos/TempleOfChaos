/* =====================================================
   TEMPLE OF CHAOS — ACCOUNT SYSTEM
===================================================== */


/* -----------------------------------------------------
   REGISTER
----------------------------------------------------- */

async function registerAccount() {

    const username =
        document
            .getElementById("registerUsername")
            .value
            .trim();


    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("registerPassword")
            .value;


    const message =
        document.getElementById(
            "authMessage"
        );


    message.textContent = "";


    /* Check fields */

    if (
        !username ||
        !email ||
        !password
    ) {

        message.textContent =
            "Please complete every field.";

        return;
    }


    /* Password length */

    if (
        password.length < 6
    ) {

        message.textContent =
            "Your password must contain at least 6 characters.";

        return;
    }


    /* Disable button */

    const button =
        document.getElementById(
            "registerButton"
        );

    button.disabled = true;

    button.textContent =
        "CREATING ACCOUNT...";


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {
                        username: username
                    },

                    emailRedirectTo:
                        window.location.origin
                }

            });


        /* Error */

        if (error) {

            throw error;

        }


        /*
           If email confirmation is enabled,
           there won't be a session yet.
        */

        if (!data.session) {

            message.textContent =
                "Account created. Check your email to verify your account.";

        } else {

            message.textContent =
                "Welcome to the Temple.";

            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                1200
            );
        }


    } catch (error) {

        message.textContent =
            error.message ||
            "Unable to create your account.";

    }


    button.disabled = false;

    button.textContent =
        "CREATE ACCOUNT";
}


/* -----------------------------------------------------
   LOGIN
----------------------------------------------------- */

async function loginAccount() {

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    const message =
        document.getElementById(
            "authMessage"
        );


    message.textContent = "";


    if (
        !email ||
        !password
    ) {

        message.textContent =
            "Please enter your email and password.";

        return;
    }


    const button =
        document.getElementById(
            "loginButton"
        );

    button.disabled = true;

    button.textContent =
        "ENTERING...";


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        if (error) {

            throw error;

        }


        if (data.session) {

            window.location.href =
                "index.html";

        }


    } catch (error) {

        message.textContent =
            error.message ||
            "Unable to sign in.";

    }


    button.disabled = false;

    button.textContent =
        "ENTER THE TEMPLE";
}


/* -----------------------------------------------------
   LOG OUT
----------------------------------------------------- */

async function logoutAccount() {

    const {
        error
    } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Logout error:",
            error
        );

        return;

    }


    window.location.href =
        "index.html";
}


/* -----------------------------------------------------
   GET CURRENT USER
----------------------------------------------------- */

async function getCurrentUser() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getUser();


    if (error) {

        console.error(
            "User error:",
            error
        );

        return null;
    }


    return data.user;
}


/* -----------------------------------------------------
   PROTECT A PAGE
----------------------------------------------------- */

async function requireLogin() {

    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return null;
    }


    return user;
}


/* -----------------------------------------------------
   UPDATE MAIN WEBSITE ACCOUNT BUTTON
----------------------------------------------------- */

async function updateAccountInterface() {

    const user =
        await getCurrentUser();


    const loginButton =
        document.getElementById(
            "accountButton"
        );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (
        !loginButton
    ) {

        return;
    }


    if (user) {

        /*
           User is logged in.
        */

        const username =
            user.user_metadata?.username ||
            user.email ||
            "MY SANCTUARY";


        loginButton.textContent =
            username;


        loginButton.href =
            "account.html";


        if (logoutButton) {

            logoutButton.style.display =
                "inline-block";

        }

    } else {

        /*
           Visitor is logged out.
        */

        loginButton.textContent =
            "ENTER THE TEMPLE";


        loginButton.href =
            "login.html";


        if (logoutButton) {

            logoutButton.style.display =
                "none";

        }

    }
}


/* -----------------------------------------------------
   RUN ON PAGE LOAD
----------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateAccountInterface();

    }
);
