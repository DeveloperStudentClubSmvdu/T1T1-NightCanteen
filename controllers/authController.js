const signup = async (req , res) => {

    return res.status(200).json({
        data : "Sign up page is ready!"
    });
}

const signin = async (req , res) => {

    return res.status(200).json({
        data : "Sign in page is ready"
    });
}

export {

    signin,
    signup
}