import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AssignTrainers({ fetchUnassignedUsers, fetchTrainers, saveUserTrainer, fetchAssignments, userId }) {
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate()
 
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [dates, setDates] = useState({ start_date: "", end_date: "" });
  const [error, SetError] = useState("");
  const auth = useSelector((state) => state.auth)

  // Load initial data
  useEffect(() => {
    loadUsers();
    loadUserAssignments();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await fetchUnassignedUsers(auth.token);
      setUsers(users)
    } catch (err) {
      SetError("Unable to get User details")
      console.error("Error fetching Users:", err)
    }
  }

  const loadTrainers = async () => {
    try {
      const trainers = await fetchTrainers(auth.token);
      setTrainers(trainers)
    } catch (err) {
      SetError("Unable to get Trainer details")
      console.error("Error fetching Trainer:", err)
    }
  }

  const loadUserAssignments = async () => {
    try {
      const trainers = await fetchTrainers(auth.token);
      let userAssignments = [];
      if (userId) {
        const data = await fetchAssignments(userId, auth.token);
        userAssignments = data.allUserTrainers
      }     

      const assignedTrainerIds = userAssignments?.map(a => a.trainer_id?._id);       
      const sortedTrainers = [
        ...trainers.filter(t => assignedTrainerIds.includes(t._id)),
        ...trainers.filter(t => !assignedTrainerIds.includes(t._id))
      ];
      setTrainers(sortedTrainers);
      setSelectedTrainers(assignedTrainerIds);
      setSelectedUser(userId || "");      
      const stdate = userAssignments[0]?.start_date?.slice(0, 10) || "";
      const enddate =userAssignments[0]?.end_date?.slice(0, 10) || "";
      setDates({ start_date: stdate, end_date: enddate });

    } catch (err) {
      SetError("Unable to get Trainer details")
      console.error("Error fetching Trainer:", err)
    }
  }

  const handleTrainerChange = (id) => {
     setSelectedTrainers(prev =>
      prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  // Save new assignment
  const handleSave = async () => {
    if (!selectedUser || selectedTrainers.length === 0) {
      SetError("Please select a user and at least one trainer");
      return;
    }
    if (!dates.start_date) {
      SetError("Please select a start date");
      return;
    }

    try {
      const data = await saveUserTrainer({
        userId: selectedUser,
        trainerIds: selectedTrainers,
        start_date: dates.start_date,
        end_date: dates.end_date || null
      }, auth.token);

      if (data.success) {
        SetError("Trainers Assignment completed Succesfully")
      } else {
        console.log(data);
        SetError(data);
      }

      // reset form
      setSelectedUser("");
      setSelectedTrainers([]);
      setDates({ start_date: "", end_date: "" });
    } catch (err) {
      console.error(err);
      SetError("Failed to save assignment");
    }
  };

  const cancelAssignment = () => {
    navigate("/admin/assignments")
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl m-2 mt-10">
      <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-3 items-center'>
        <h1 className='text-xl font-bold m-2 sm:m-0 '>Assign Trainers</h1>
        <Link to='/admin/assignments' >
          <span className="rounded-md text-blue-600 font-bold px-4 py-1.5 hover:bg-blue-50 transition-colors">Manage Assignment</span></Link>
      </div>

      <div className="grid grid-cols-2 px-5 gap-4">
        <div>
          <label className="block mb-2">Select User:</label>
          <select className="border p-2 w-full rounded mb-4" value={selectedUser} disabled={userId}
            onChange={(e) => setSelectedUser(e.target.value)} >
            <option value="">-- Select User --</option>
            {users?.map(u => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Select Trainers:</label>
          <div className="border rounded p-3 mb-4 h-40 overflow-y-auto">
            {trainers?.map(trainer => (
              <div key={trainer._id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedTrainers.includes(trainer.userId._id)}
              onChange={() => handleTrainerChange(trainer.userId._id)}
              className="mr-2"
            />
            <label>
              <span className="font-medium">{trainer.userId?.name || "Unnamed"}</span>
              <span className="text-gray-500 text-sm ml-2">
                ({trainer.specialization})
              </span>
            </label>
          </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Start Date:</label>
          <input type="date" className="border p-2 w-full rounded mb-4" value={dates.start_date}
            onChange={(e) => setDates({ ...dates, start_date: e.target.value })} />
        </div>

        <div>
          <label className="block mb-2">End Date:</label>
          <input type="date" className="border p-2 w-full rounded mb-4" value={dates.end_date}
            onChange={(e) => setDates({ ...dates, end_date: e.target.value })} />
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button onClick={handleSave} className="rounded-md bg-blue-600 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Save Assignment
          </button>
          <button type="button" onClick={cancelAssignment} className="border border-transparent bg-white hover:border-blue-500 hover:bg-blue-50 px-4 py-2 rounded transition ">
            Cancel
          </button>
        </div>
        {error.length > 0 &&
          <div>
            <span className='text-red-400 p-5'>{error}</span>
          </div>}
      </div>
    </div>
  );
}
