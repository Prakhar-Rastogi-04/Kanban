import { useNavigate } from 'react-router-dom';
import './register.css';
import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { registerUserCall } from '../../utilities/commonApiCalls';
const Register = () => {
    const navigateTo = useNavigate();
    const [alertMsg, setAlertMsg] = useState({ msg : '' , isErr: false});
    const schema = Yup.object().shape({
        firstName: Yup.string().min(3).required(),
        lastName: Yup.string().min(3).required(),
        email: Yup.string().email().required(),
        password : Yup.string().required()
                      .min(8, "Pasword must be 8 or more characters")
                      .max(16, "Pasword must be maximum 16 characters")
                      .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password ahould contain at least one uppercase and lowercase character")
                      .matches(/\d/, "Password should contain at least one number")
                      .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character"),
        confPassword: Yup.string().when("password", (password, field) => {
                            if (password) {
                                return field.required("The passwords do not match").oneOf([Yup.ref("password")], "The passwords do not match");
                            }
                        }),
        phone : Yup.string().required().min(10),
        permission : Yup.string().required()
      });

   
    const handleOnSubmit = async (values) => {
        const fullName = Object.keys(values)
          .map((key) => values[key])
          .join(" ");
        console.log(`Hello ${fullName}!`);
        
        // const userData = formik.values
        const {confPassword , ...userData} = formik.values;
        console.log('formik ', userData);
        const res = await registerUserCall(userData);
        if(res.status === 200) {
            setAlertMsg(prev => {
                return {...prev, msg : 'User is registered successfully'}
            })
        } else {
            setAlertMsg(prev => {
                return {...prev, msg : 'Something went wrong, please re-try', isErr : true}
            })
        }
      };
    
      const formik = useFormik({
        initialValues: {
          firstName: "",
          lastName: "",
          email:"",
          password: "",
          phone:"",
          permission:''
        },
        validationSchema: schema,
        onSubmit: handleOnSubmit,
      });

      const setInputValue = useCallback(
        (key, value) =>
          formik.setValues({
            ...formik.values,
            [key]: value,
          }),
        [formik]
      );

    const gotoLogin = () => {
        navigateTo('/login');
    }
    const handleRegister = () => {

    }
    const handleInputChange = (event, formik) => {
        console.log('event ', event);
        console.log('formik ', formik);
        // const { name , value } = event.target;
        // setFormData({ ...formData, [name] : value})
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">TaskBook</h3>
                    <span className="loginDesc">Track all your daily tasks on Taskbook.</span>
                </div>
                <div className="loginRight">
                    <div className="loginBox">
                       {alertMsg.msg && <div className={ alertMsg.isErr ? 'alert-danger messageBox' : 'alert-success messageBox'}>{alertMsg.msg}</div>}
                       <form onSubmit={formik.handleSubmit}>
                                <div className="inputContainer">
                                    <input  className="loginInput"
                                        placeholder="Type your First Name"
                                        value={formik.values.firstName}
                                        onChange={(e) => setInputValue("firstName", e.target.value)}
                                    />
                                    <small className="errorText capitalise">{formik.errors.firstName}</small>
                                </div>
                                
                                <div className="inputContainer">
                                    <input className="loginInput"
                                        placeholder="Type your Last Name"
                                        value={formik.values.lastName}
                                        onChange={(e) => setInputValue("lastName", e.target.value)}
                                    />
                                    <small className="errorText capitalise">{formik.errors.lastName}</small>
                                </div>

                                <div className="inputContainer">
                                    <input id="email" type="text" placeholder='email' className="loginInput" name='email' 
                                    value={formik.values.email}
                                    onChange={(e) => setInputValue("email", e.target.value)}
                                    onBlur={formik.handleBlur} />
                                    <small className="errorText capitalise">{formik.errors.email}</small>
                                </div>

                                <div className="inputContainer">
                                    <input type="password" placeholder='password' className="loginInput" name='password' onBlur={formik.handleBlur} value={formik.values.password} 
                                    onChange={(e) => setInputValue("password", e.target.value)}  />   
                                    <small className="errorText capitalise">{formik.errors.password}</small>
                                </div>
                                
                                <div className="inputContainer">
                                    <input type="password" placeholder='password again' className="loginInput" name='confPassword' onBlur={formik.handleBlur} value={formik.values.confPassword}
                                    onChange={(e) => setInputValue("confPassword", e.target.value)} />
                                    <small className="errorText capitalise">{formik.errors.confPassword}</small>
                                </div>

                                <div className="inputContainer">
                                    <input type="number" placeholder='phone number' className="loginInput" name='phone' maxLength={10} value={formik.values.phone} onBlur={formik.handleBlur} 
                                    onChange={(e) => setInputValue("phone", e.target.value)} />
                                    <small className="errorText capitalise">{formik.errors.phone}</small>
                                </div>

                                <div className="inputContainer">
                                <select className='loginInput' name='permission' onChange={(e) => setInputValue("permission", e.target.value)} value={formik.values.permission} onBlur={formik.handleBlur} >
                                    <option value='' selected disabled>select role</option>
                                    <option value='dev'>Developer</option>
                                    <option value="admin">Admin</option>
                                    <option value="hr">Human Resource</option>
                                    <option value="customer">Customer</option>
                                </select>
                                    <small className="errorText capitalise">{formik.errors.permission}</small>
                                </div>

                                <div className="btnContainer">
                                    <button type="submit" className="loginButton margin-bottom" disabled={!formik.isValid}>  Submit  </button>
                                    <button className="loginRgisterButton" onClick={gotoLogin}>Login into Account</button>
                                </div>
                                
                        </form>
                    </div>
                </div>

                {/* end of exp snippet */}


            </div>
        </div>
    )
}
export default Register;