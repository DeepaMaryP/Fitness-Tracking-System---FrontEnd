import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { updateUserPassword } from '../../api/admin/user';

function ChangePasswordPage() {
    const userId = useParams().id
    const auth = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState({ _id: userId });
    const [error, SetError] = useState("");
    const [errorObject, setErrorObject] = useState({ passwordHash: "", confirmPassword: "", passwordMismatch: "" })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevValues => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const validateInputs = () => {
        let isValid = true;
        setErrorObject({ role: "", passwordHash: "", confirmPassword: "", passwordMismatch: "" })

        if (user.passwordHash.length == 0) {
            setErrorObject((prevValue) => ({
                ...prevValue,
                passwordHash: "Please enter Password"
            }))
            isValid = false;
        }
        if (user.passwordHash.length < 8) {
            setErrorObject((prevValue) => ({
                ...prevValue,
                passwordHash: "Password must be of 8 characters"
            }))
            isValid = false;
        }
        if (user.confirmpassword.length == 0) {
            setErrorObject((prevValue) => ({
                ...prevValue,
                confirmPassword: "Please confirm Password"
            }))
            isValid = false;
        }
        if (user.passwordHash !== user.confirmpassword) {
            setErrorObject((prevValue) => ({
                ...prevValue,
                passwordMismatch: "Passwords do not match"
            }))
            isValid = false;
        }

        return isValid;
    }

    const changePassword = (event) => {
        event.preventDefault();
        if (validateInputs()) {
            updateUser();
        }
    }

    const updateUser = async () => {
        try {
            const data = await updateUserPassword(user, auth.token);
            if (data.success) {
                SetError("Password updated Succesfully. Sign in with new password")
            } else {
                console.log(data);
                SetError(data);
            }
        } catch (err) {
            SetError("Something went wrong. Please try again.");
            console.error("Failed to update user:", err);
        }
    };

    const cancelUpdate = () => {
        navigate("/admin/users")
    }

    return (
        <div className='m-10'>
            <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-5 items-center'>
                <h1 className='text-xl font-bold m-2 sm:m-0 '>Change Password</h1>
                <Link to='/admin/users' >
                    <span className="rounded-md text-blue-600 font-bold px-4 py-1.5 hover:bg-blue-50 transition-colors">Manage Users</span></Link>
            </div>
            <form className='border rounded p-5 m-auto w-3/4' onSubmit={changePassword}>
                <div>
                    <div className="grid grid-cols-5 ">
                        <label htmlFor="password" className='text-center'>Password :</label>
                        <div className='col-span-4 flex'>
                            <input type={showPassword ? "text" : "password"} id="password" maxLength="8" value={user?.passwordHash} required name="passwordHash" className='border w-1/2' onChange={handleChange} placeholder='Enter password' />
                            <div className='pl-3'>
                                <input type="checkbox" name="showpassword" id="showpassword" onClick={() => setShowPassword(!showPassword)} className="m-2" />
                                <label htmlFor="showpassword">Show Password</label>
                                <div>{errorObject.passwordHash.length > 0 && <label htmlFor="password" className='text-red-500 pl-2'>{errorObject.passwordHash}</label>}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 my-5">
                        <label htmlFor="confirmpassword" className='text-center'>Confirm Password :</label>
                        <div className='col-span-4'>
                            <input type="password" id="confirmpassword" maxLength="8" value={user?.confirmPassword} required name="confirmpassword" className='border w-1/2' onChange={handleChange} placeholder='Confirm Password' />
                            <div>{errorObject.passwordMismatch.length > 0 && <label htmlFor="confirmpassword" className='text-red-500 pl-2'>{errorObject.passwordMismatch}</label>}</div>
                        </div>
                    </div>

                    {error.length > 0 &&
                        <div>
                            <span className='text-red-400 p-5'>{error}</span>
                        </div>}

                    <div className="mt-6 flex items-center justify-center gap-x-6">
                        <button className="border border-transparent bg-white hover:border-blue-500 hover:bg-blue-50 px-4 py-2 rounded transition" onClick={cancelUpdate}>
                            Cancel
                        </button>
                        <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ChangePasswordPage
