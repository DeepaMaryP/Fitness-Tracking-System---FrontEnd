import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import LogInHeader from '../../components/LogInHeader';
import { registerNewUser } from '../../api/admin/user';

function RegistrationPage() {
    const [user, setUser] = useState({ role: 0 });
    const [error, SetError] = useState("");
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);

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

    const [errorObject, setErrorObject] = useState({ passwordHash: "", confirmPassword: "", passwordMismatch: "" })

    const validateInputs = () => {
        let isValid = true;
        setErrorObject({ passwordHash: "", confirmPassword: "", passwordMismatch: "" })

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
            user.role = "User"
            const data = await registerNewUser(user);
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
  <div>
    <LogInHeader />

    <div className="flex w-full sm:w-3/4 mx-auto flex-1 flex-col justify-center mt-10 sm:mt-14 pb-5 px-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Create User</h1>
        <Link to="/login">
          <span className="rounded-md border border-blue-500 text-blue-600 font-semibold px-4 py-1.5 hover:bg-blue-50 transition">
            Log In
          </span>
        </Link>
      </div>

      {/* Form */}
      <form
        className="border rounded-lg p-5 sm:p-8 w-full sm:w-3/4 mx-auto bg-white shadow-sm"
        onSubmit={saveUser}
      >
        <div className="space-y-6">
          {/* Name */}
          <div className="flex flex-col sm:grid sm:grid-cols-5 sm:items-center gap-2">
            <label htmlFor="name" className="sm:text-right font-medium">
              Name :
            </label>
            <input
              type="text"
              id="name"
              value={user?.firstName}
              required
              name="name"
              maxLength="50"
              onChange={handleChange}
              placeholder="Enter Name"
              className="col-span-4 border rounded-md px-2 py-1 w-full sm:w-3/4"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col sm:grid sm:grid-cols-5 sm:items-center gap-2">
            <label htmlFor="email" className="sm:text-right font-medium">
              Email :
            </label>
            <input
              type="email"
              id="email"
              value={user?.email}
              maxLength="35"
              required
              name="email"
              onChange={handleChange}
              placeholder="Enter email"
              className="col-span-4 border rounded-md px-2 py-1 w-full sm:w-3/4"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col sm:grid sm:grid-cols-5 sm:items-start gap-2">
            <label htmlFor="password" className="sm:text-right font-medium">
              Password :
            </label>
            <div className="col-span-4 w-full sm:w-3/4">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                maxLength="8"
                value={user?.passwordHash}
                required
                name="passwordHash"
                onChange={handleChange}
                placeholder="Enter password"
                className="border rounded-md px-2 py-1 w-full"
              />
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showpassword"
                  onClick={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showpassword" className="text-sm">
                  Show Password
                </label>
              </div>
              {errorObject.passwordHash.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {errorObject.passwordHash}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col sm:grid sm:grid-cols-5 sm:items-start gap-2">
            <label htmlFor="confirmpassword" className="sm:text-right font-medium">
              Confirm Password :
            </label>
            <div className="col-span-4 w-full sm:w-3/4">
              <input
                type="password"
                id="confirmpassword"
                maxLength="8"
                value={user?.confirmPassword}
                required
                name="confirmpassword"
                onChange={handleChange}
                placeholder="Confirm Password"
                className="border rounded-md px-2 py-1 w-full"
              />
              {errorObject.passwordMismatch.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {errorObject.passwordMismatch}
                </p>
              )}
            </div>
          </div>

          {/* General Error */}
          {error.length > 0 && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={cancelAddUser}
              className="border border-blue-400 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 rounded-md transition w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-md w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);

}

export default RegistrationPage
