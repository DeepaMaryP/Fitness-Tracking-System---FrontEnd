import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import DynamicDropdown from '../../components/DynamicDropdown';
import { getRoles } from '../../helpers/userHelper';
import { createUser, createUserTrainer, fetchUserWithId, updateUser, updateUserTrainer } from '../../api/admin/user';
import { fetchTrainerWithUserId } from '../../api/admin/trainerProfile';

function AddUserPage() {
  const userId = useParams().id
  const [user, setUser] = useState({ role: 0, _id: 0 });
  const [trainer, setTrainer] = useState({ userId: userId });
  const auth = useSelector((state) => state.auth)

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

  const loadUser = async () => {
    try {
      const data = await fetchUserWithId(userId, auth.token)
      setUser(data)

      if (data.role == "Trainer") {
        loadTrainer()
      }
    } catch (err) {
      SetError("Unable to get user details")
      console.error("Error fetching user:", err)
    }
  }

  const loadTrainer = async () => {
    try {
      const result = await fetchTrainerWithUserId(userId, auth.token)
      if (result.success && result.data) {
        setTrainer(result.data)
      }
    } catch (err) {
      SetError("Unable to get trainer details")
      console.error("Error fetching trainer:", err)
    }
  }

  useEffect(() => {
    loadRoles()
    if (userId) {
      loadUser();
    }
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

  const handleChangeTrainer = (event) => {
    const { name, value } = event.target;
    setTrainer(prevValues => ({
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

    if (user._id != 0) return isValid;
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
      const data = await createUser(user, auth.token);
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

  const createNewUserTrainer = async () => {
    try {
      const userTrainer = { user, trainer }
      const data = await createUserTrainer(userTrainer, auth.token);
      if (data.success) {
        SetError("User Created Succesfully.Continue Sign in with " + data.userName)
      } else {
        console.log(data);
        SetError(data || "Failed to create user");
      }
    } catch (err) {
      SetError("Something went wrong. Please try again.");
      console.error("Failed to create user:", err);
    }
  };

  const updateUserDetails = async () => {
    try {
      const data = await updateUser(user, auth.token);
      if (data.success) {
        SetError("User Updated Succesfully")
      } else {
        console.log(data);
        SetError(data);
      }
    } catch (err) {
      SetError("Something went wrong. Please try again.");
      console.error("Failed to update user:", err);
    }
  };

  const updateUserTrainerDetails = async () => {
    try {
      const userTrainer = { user, trainer }
      const data = await updateUserTrainer(userTrainer, auth.token);
      if (data.success) {
        SetError("User Updated Succesfully")
      } else {
        console.log(data);
        SetError(data);
      }
    } catch (err) {
      SetError("Something went wrong. Please try again.");
      console.error("Failed to update user:", err);
    }
  };

  const saveUser = (event) => {
    event.preventDefault();

    if (validateInputs()) {
      if (user._id != 0) { //update user
        if (user.role == "Trainer") { // for trainer, update trainer profile too
          updateUserTrainerDetails();
        } else {
          updateUserDetails();
        }
      } else {
        if (user.role == "Trainer") { // for trainer, insert trainer profile too
          createNewUserTrainer();
        } else {
          createNewUser();
        }
      }
    }
  }

  return (
    <div className='max-w-5xl mx-auto bg-white shadow-lg rounded-2xl m-2 mt-10'>
      <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-3 items-center'>
        <h1 className='text-xl font-bold m-2 sm:m-0 '>Create User</h1>
        <Link to='/admin/users' >
          <span className="rounded-md text-blue-600 font-bold px-4 py-1.5 hover:bg-blue-50 transition-colors">Manage Users</span></Link>
      </div>

      <form className=' m-5 mb-10' onSubmit={saveUser}>
        <div className=''>
          <div className='space-y-3'>
            <div>
              <label htmlFor="name" className='block' >Name</label>
              <input type="text" id="name" value={user?.name} required name="name" maxLength="50" className='border w-3/4 rounded-sm p-1' onChange={handleChange} placeholder='Enter Name' />
            </div>

            <div>
              <label htmlFor="email" className='block'>Email</label>
              <input type="email" id="email" value={user?.email} maxLength="35" required name="email" className='border w-3/4 rounded-sm p-1' onChange={handleChange} placeholder='Enter email' />
            </div>
            {(!userId) &&
              <div>
                <div className='space-y-3'>
                  <div>
                    <label htmlFor="password" className='block'>Password</label>
                    <input type={showPassword ? "text" : "password"} id="password" maxLength="8" value={user?.passwordHash} required name="passwordHash" className='border w-3/4 rounded-sm p-1' onChange={handleChange} placeholder='Enter password' />
                  </div>

                  <div className='pl-3 my-2 flex'>
                    <input type="checkbox" name="showpassword" id="showpassword" onClick={() => setShowPassword(!showPassword)} className="m-2" />
                    <label htmlFor="showpassword" >Show Password</label>
                    <div>{errorObject.passwordHash.length > 0 && <label htmlFor="password" className='text-red-500 pl-2'>{errorObject.passwordHash}</label>}</div>
                  </div>

                </div>

                <div >
                  <label htmlFor="confirmpassword" className='block'>Confirm Password</label>
                  <div className='col-span-4'>
                    <input type="password" id="confirmpassword" maxLength="8" value={user?.confirmPassword} required name="confirmpassword" className='border w-3/4 rounded-sm p-1' onChange={handleChange} placeholder='Confirm Password' />
                    <div>{errorObject.passwordMismatch.length > 0 && <label htmlFor="confirmpassword" className='text-red-500 pl-2'>{errorObject.passwordMismatch}</label>}</div>
                  </div>
                </div>
              </div>}

            <div >
              <label htmlFor="role" className='block' >Role</label>
              <div className='flex w-fit'>
                <DynamicDropdown onData={getSelectedRole} item={roleList} selectedItem={user?.role} id="role" readOnly={user._id != 0} name='Select Role' />
                <div>{errorObject.role.length > 0 && <label htmlFor="role" className='text-red-500 pl-2'>{errorObject.role}</label>}</div>
              </div>
            </div>
          </div>

          {user?.role === "Trainer" &&
            <div className='space-y-3 mt-2'>
              <div >
                <label htmlFor="qualification" className='block'>Qualification</label>
                <input type="text" id="qualification" value={trainer?.qualification} required name="qualification" maxLength="25" className='border w-3/4 rounded-sm p-1' onChange={handleChangeTrainer} placeholder='Enter Qualification' />
              </div>

              <div >
                <label htmlFor="experience" className='block'>Experience (Years)</label>
                <input type="text" id="experience" value={trainer?.experience_years} maxLength="10" required name="experience_years" className='border w-3/4 rounded-sm p-1' onChange={handleChangeTrainer} placeholder='Enter Experience' />
              </div>

              <div >
                <label htmlFor="specialization" className='block'>Specialization :</label>
                <input type="text" id="specialization" value={trainer?.specialization} maxLength="35" required name="specialization" className='border w-3/4 rounded-sm p-1' onChange={handleChangeTrainer} placeholder='Enter Specialization' />
              </div>

              <div >
                <label htmlFor="certification" className='block'>Certification :</label>
                <input type="text" id="certification" value={trainer?.certification} maxLength="35" required name="certification" className='border w-3/4 rounded-sm p-1' onChange={handleChangeTrainer} placeholder='Enter Certification' />
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
            {userId &&
              <Link to={`/admin/changepwd/${user._id}`}>
                <span
                  className="rounded-md bg-blue-600 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Change Password
                </span> </Link>}
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddUserPage
