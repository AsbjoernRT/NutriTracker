exports.renderLogIn = (req, res) => {
    //Ser om brugeren er logget ind, hvis der er tilfældes sendes brugeren bare til forsiden
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    //Hvis ikke renderes login-siden
    res.render('../views/pages/login.ejs', {error: ''});
}