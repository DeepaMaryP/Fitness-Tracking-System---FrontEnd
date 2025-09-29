import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import DynamicDropdown from '../../components/DynamicDropdown';
import { getRoles } from '../../helpers/userHelper';

function AddUserPage() {
  const [user, setUser] = useState({ role: 0 });
  const [trainer, setTrainer] = useState();

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
   setUser((prevUser) => ({
    ...prevUser,
    role: selectedItem
  }));
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevValues => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const cancelAddUser = () => {
    navigate("/admin/users")
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
    <div className='m-2'>
      <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-3 items-center'>
        <h1 className='text-xl font-bold m-2 sm:m-0 '>Create User</h1>
        <Link to='/admin/users' >
          <span className="rounded-md text-blue-600 font-bold px-4 py-1.5 hover:bg-blue-50 transition-colors">Manage Users</span></Link>
      </div>

      <form className='border rounded pt-5 ml-2' onSubmit={saveUser}>
        <div className=''>
          <div>
            <div className='grid grid-cols-5'>
              <label htmlFor="name" className='text-center'>Name :</label>
              <input type="text" id="name" value={user?.firstName} required name="name" maxLength="50" className='col-span-4 border w-1/2' onChange={handleChange} placeholder='Enter Name' />
            </div>

            <div className="grid grid-cols-5 my-5">
              <label htmlFor="email" className='text-center'>Email :</label>
              <input type="email" id="email" value={user?.email} maxLength="35" required name="email" className='col-span-4 border w-1/2' onChange={handleChange} placeholder='Enter email' />
            </div>

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

            <div className="grid grid-cols-5 my-5">
              <label htmlFor="role" className='text-center' >Role :</label>
              <div className='col-span-4'>
                <DynamicDropdown onData={getSelectedRole} item={roleList} selectedItem={user?.role} id="role" name='Select Role' />
                <div>{errorObject.role.length > 0 && <label htmlFor="role" className='text-red-500 pl-2'>{errorObject.role}</label>}</div>
              </div>
            </div>
          </div>
{console.log(user?.role)}
          {user?.role === "Trainer" &&
            <div>
              <div className='grid grid-cols-5'>
                <label htmlFor="qualification" className='text-center'>Qualification :</label>
                <input type="text" id="qualification" value={trainer?.qualification} required name="qualification" maxLength="25" className='col-span-4 border w-1/2' onChange={handleChange} placeholder='Enter Qualification' />
              </div>

              <div className="grid grid-cols-5 my-5">
                <label htmlFor="experience" className='text-center'>Experience (Years) :</label>
                <input type="text" id="experience" value={trainer?.experience} maxLength="10" required name="experience" className='col-span-4 border w-1/2' onChange={handleChange} placeholder='Enter Experience' />
              </div>

              <div className="grid grid-cols-5 my-5">
                <label htmlFor="specialization" className='text-center'>Specialization :</label>
                <input type="text" id="specialization" value={trainer?.specialization} maxLength="35" required name="specialization" className='col-span-4 border w-1/2' onChange={handleChange} placeholder='Enter Specialization' />
              </div>

              <div className="grid grid-cols-5 my-5">
                <label htmlFor="certification" className='text-center'>Certification :</label>
                <input type="text" id="certification" value={trainer?.certification} maxLength="35" required name="certification" className='col-span-4 border w-1/2' onChange={handleChange} placeholder='Enter Certification' />
              </div>
            </div>
          }

          {error.length > 0 &&
            <div>
              <span className='text-red-400 p-5'>{error}</span>
            </div>}

          <div className="mt-6 flex items-center justify-center gap-x-6">
            <button className="border border-transparent bg-white hover:border-blue-500 hover:bg-blue-50 px-4 py-2 rounded transition" onClick={cancelAddUser}>
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddUserPage
