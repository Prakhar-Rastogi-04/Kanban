import { useNavigate } from 'react-router-dom';
import './login.css';
import { useState } from 'react';
import { loginCall } from '../../utilities/commonApiCalls';
import Loader from '../../components/uiComponents/loader/Loader';
import { addSessionVariable } from '../../utilities/util';
import { fakeAuthProvider } from '../../utilities/auth';
const Login = () => {
    const navigate = useNavigate();
    const [input , setInput] = useState({email:'' , password:''});
    const [errorText , setErrorText] = useState('');
    const [ loading, setLoading] = useState(false);
    const handleLogin = async () => {
        // validate Inputs
        const isValidInputs = inputValidation();
        //  login
        if(isValidInputs) {
            setLoading(true);
            const res = await loginCall(input);
            if(res.status===200) {
                addSessionVariable(res , true);
                fakeAuthProvider.signIn(res.data.firstName +' '+res.data.lastName);
                setTimeout(() => {
                    setLoading(false);
                    navigate('/'); 
                }, 2000);
            }
            else if(res.status === 401) {
                setLoading(false);
                setErrorText(res.data.msg)
            } else setErrorText('Something went wrong. Please retry !!')
        }
    }
    const handleInput = (event) =>{
        const {name, value} = event.target;
        setInput({...input, [name]: value})
    }
    const gotoRegister = () => {
        navigate('/register')
    }
    const inputValidation = () => {
        return true
    }
    return (
        <div className="login">
            <Loader isOpen = {loading} />
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">TaskBook</h3>
                    <span className="loginDesc">Track all your daily tasks on Taskbook.</span>
                </div>
                <div className="loginRight">
                    <div className="loginBox">
                        <div className="errorBox errorText"> { errorText } </div>
                        <input type="text" placeholder='email' className="loginInput" name='email' value={input.email} onChange={handleInput} />
                        <input type="password" placeholder='password' className="loginInput" name='password' value={input.password} onChange={handleInput} />
                        <button className="loginButton" onClick={handleLogin}>Login</button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button className="loginRgisterButton" onClick={gotoRegister}>Create a new account</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;