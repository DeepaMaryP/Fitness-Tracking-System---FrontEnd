import React from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../../api/auth';
import LogInHeader from '../../components/LogInHeader';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const planId = useParams().id;

  const [error, SetError] = useState("");
  const [credentials, setCredentials] = useState(
    {
      email: '',
      password: ''
    }
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prevLogIn => ({
      ...prevLogIn,
      [name]: value
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    SetError('');
    try {
      const resultAction = await dispatch(signIn(credentials)).unwrap();
      if (resultAction.success) {
        switch (resultAction.role) {
          case "Admin":
            navigate("/admin");
            break;
          case "Trainer":
            navigate("/trainer");
            break;
          default:
            if (planId) {
              navigate(`/subscribe/${planId}`)
            } else {
              navigate("/user");
            }
        }
      }
    } catch (error) {
      console.log(error);
      SetError(error)
    }
  }

  return (
    <div>
      <LogInHeader />
      {planId && <div className='text-center text-blue-600 font-bold'>
        Please SignIn to continue Subscription
      </div>}
      <div className="flex w-3/4 lg:w-1/3 mx-auto flex-1 flex-col justify-center mt-14 pb-5 border rounded-lg ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block pl-2 text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={credentials?.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="password" className="pl-2 block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials?.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="block border w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            {error.length > 0 &&
              <div>
                <span className='text-red-400 p-5'>{error}</span>
              </div>}

            <div className='flex'>
              <button
                type="submit"
                className="w-1/2 justify-center rounded-md bg-blue-500 py-1.5 mr-10 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span>Sign in</span>
              </button>

              <Link to='/register' className='w-1/2' >
                <span className='flex justify-center items-center w-full py-1.5 rounded-md border border-blue-500 text-sm/6 font-semibold text-blue-500 shadow-xs hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                  Create User</span>
              </Link>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}