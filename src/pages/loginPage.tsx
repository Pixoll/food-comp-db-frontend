import "../assets/css/_login.css"
const loginPage = () =>{
    return (
        <div className="login-div">
            <h1>Login</h1>
            <form method="post">
                <div className="txt_field">
                    <input type="text" required />
                    <span></span>
                    <label>Username</label>
                </div>
                <div className="txt_field">
                    <input type="password" required />
                    <span></span>
                    <label>Password</label>
                </div>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default loginPage;