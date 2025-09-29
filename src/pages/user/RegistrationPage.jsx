import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import DynamicDropdown from '../../components/DynamicDropdown';
import { createUser } from '../../api/user';
import { getRoles } from '../../helpers/userHelper';

function RegistrationPage() {
    const [user, setUser] = useState({ role: 0 });
    const [roleList, SetRoleList] = useState([]);
    const [error, SetError] = useState("");
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);

    const loadRoles = async () => {
        try {
            const roles = getRoles();
            SetRoleList(roles);
        } catch (err) {
            console.error("Error fetching roles:", err)
        }
    }

    useEffect(() => {
        loadRoles()
    }, [])


    const getSelectedRole = (selectedItem) => {
        user.role = selectedItem;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevValues => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const cancelAddUser = () => {
        navigate("/login")
    }

    const [errorObject, setErrorObject] = useState({ role: "", passwordHash: "", confirmPassword: "", passwordMismatch: "" })

    const validateInputs = () => {
        let isValid = true;
        setErrorObject({ role: "", passwordHash: "", confirmPassword: "", passwordMismatch: "" })

        if (user.role == 0) {
            setErrorObject((prevValue) => ({
                ...prevValue,
                role: "Please select Role"
            }))
            isValid = false;
        }
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

    const createNewUser = async () => {
        try {
            const data = await createUser(user);
            if (data.success) {
                SetError("User Created Succesfully.Continue Sign in with " + data.userName)
                //navigate("/login");
            } else {
                console.log(data);
                SetError(data);
            }
        } catch (err) {
            SetError("Something went wrong. Please try again.");
            console.error("Failed to create user:", err);
        }
    };

    const saveUser = (event) => {
        event.preventDefault();
        if (validateInputs()) {
            createNewUser();
        }
    }

    return (
        <div className='m-15'>
            <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-5 items-center'>
                <h1 className='text-xl font-bold m-2 sm:m-0 '>Create User</h1>
                <Link to='/login' >
                    <span className="rounded-md border border-yellow-500 text-yellow-600 font-bold px-4 py-1.5 hover:bg-amber-50 transition-colors">LogIn</span></Link>
            </div>
            <form className='border rounded p-5 m-auto w-3/4' onSubmit={saveUser}>
                <div className=''>
                    <div className='grid grid-cols-5'>
                        <label htmlFor="name" className='pr-20 text-center'>Name :</label>
                        <input type="text" id="name" value={user?.firstName} required name="name" maxLength="50" className='col-span-4 border w-1/2' onChange={handleChange} placeholder='Enter Name' />
                    </div>

                    <div className="grid grid-cols-5 my-8">
                        <label htmlFor="email" className='pr-20 text-center'>Email :</label>
                        <input type="email" id="email" value={user?.email} maxLength="35" required name="email" className='col-span-4 border w-1/2' onChange={handleChange} placeholder='Enter email' />
                    </div>

                    <div className="grid grid-cols-5 ">
                        <label htmlFor="password" className='pr-20 text-center'>Password :</label>
                        <div className='col-span-4'>
                            <input type={showPassword ? "text" : "password"} id="password" maxLength="8" value={user?.passwordHash} required name="passwordHash" className='border w-1/2' onChange={handleChange} placeholder='Enter password' />
                            <div>
                                <input type="checkbox" name="showpassword" id="showpassword" onClick={() => setShowPassword(!showPassword)} className="m-2" />
                                <label htmlFor="showpassword">Show Password</label>
                                <div>{errorObject.passwordHash.length > 0 && <label htmlFor="password" className='text-red-500 pl-2'>{errorObject.passwordHash}</label>}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 my-8">
                        <label htmlFor="confirmpassword">Confirm Password :</label>
                        <div className='col-span-4'>
                            <input type="password" id="confirmpassword" maxLength="8" value={user?.confirmPassword} required name="confirmpassword" className='border w-1/2' onChange={handleChange} placeholder='Confirm Password' />
                            <div>{errorObject.passwordMismatch.length > 0 && <label htmlFor="confirmpassword" className='text-red-500 pl-2'>{errorObject.passwordMismatch}</label>}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 my-8">
                        <label htmlFor="role" className='pr-20 text-center' >Role :</label>
                        <div className='col-span-4'>
                            <DynamicDropdown onData={getSelectedRole} item={roleList} selectedItem={user?.role} id="role" name='Select Role' />
                            <div>{errorObject.role.length > 0 && <label htmlFor="role" className='text-red-500 pl-2'>{errorObject.role}</label>}</div>
                        </div>
                    </div>

                    {error.length > 0 &&
                        <div>
                            <span className='text-red-400 p-5'>{error}</span>
                        </div>}

                    <div className="mt-6 flex items-center justify-center gap-x-6">
                        <button className="border border-transparent bg-white hover:border-yellow-500 hover:bg-amber-50 px-4 py-2 rounded transition" onClick={cancelAddUser}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-yellow-600 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegistrationPage
