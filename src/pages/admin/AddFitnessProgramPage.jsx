import React, { useEffect, useState } from "react";
import { createFitnessProgram, fetchFitnessProgramWithId, updateFitnessProgram } from "../../api/fitnessPrograms";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function AddFitnessProgramPage() {
  const [error, SetError] = useState("");
  const auth = useSelector((state) => state.auth)
  const trainerTypes = ["Diet", "Workout", "Yoga", "General"];
  const fitProgramId = useParams().id
  const [fitProgram, SetFitProgram] = useState({
    _id: 0,
    name: "",
    description: "",
    price: "",
    duration_days: "",
    features: {
      trainers: [
        // { trainer_type: "", count: 1 }
      ],
      support_level: "Basic",
      diet_plan_access: false,
      workout_plan_access: false,
      yoga_plan_access: false,
      status: "Active",
    },
  });

  const loadFitnessProgram = async () => {
    try {
      const data = await fetchFitnessProgramWithId(fitProgramId, auth.token)
      SetFitProgram(data)
    } catch (err) {
      SetError("Unable to get Fitness Program details")
      console.error("Error fetching FitnessProgram:", err)
    }
  }

  useEffect(() => {
    loadFitnessProgram();
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("features.")) {
      const key = name.replace("features.", "");
      SetFitProgram((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      SetFitProgram((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleTrainerChange = (index, field, value) => {
    const updatedTrainers = [...fitProgram.features.trainers];
    updatedTrainers[index][field] =
      field === "count" ? Number(value) : value;
    SetFitProgram((prev) => ({
      ...prev,
      features: { ...prev.features, trainers: updatedTrainers },
    }));
  };

  // Add new trainer row
  const handleAddTrainer = () => {
    // Prevent adding if all types are already selected
    if (fitProgram.features.trainers.length >= trainerTypes.length) return;

    SetFitProgram((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        trainers: [
          ...prev.features.trainers,
          { trainer_type: "", count: 1 }, // default blank
        ],
      },
    }));
  };

  // Remove trainer row
  const handleRemoveTrainer = (index) => {
    SetFitProgram((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        trainers: prev.features.trainers.filter((_, i) => i !== index),
      },
    }));
  };

  const [errorObject, setErrorObject] = useState({ name: "", price: "", duration: "", trainer: "" })

  const validateInputs = () => {
    let isValid = true;
    setErrorObject({ name: "", price: "", duration: "", trainer: "" })

    if (fitProgram.name.length == 0) {
      setErrorObject((prevValue) => ({
        ...prevValue,
        name: "Please select Name"
      }))
      isValid = false;
    }

    if (fitProgram.price == 0) {
      setErrorObject((prevValue) => ({
        ...prevValue,
        price: "Please select Price"
      }))
      isValid = false;
    }

    if (fitProgram.duration == 0) {
      setErrorObject((prevValue) => ({
        ...prevValue,
        duration: "Please select Duration"
      }))
      isValid = false;
    }

    /*  if (fitProgram.features?.trainers.length > 0) {      
       setErrorObject((prevValue) => ({
         ...prevValue,
         trainer: "Please select Trainer"
       }))
       isValid = false;
     } */
    return isValid;
  }

  const createFitProgram = async () => {
    try {
      const data = await createFitnessProgram(fitProgram, auth.token);
      if (data.success) {
        SetError("Fitness Program Created Succesfully")
      } else {
        console.log(data);
        SetError(data);
      }
    } catch (err) {
      SetError("Something went wrong. Please try again.");
      console.error("Failed to create Fitness Program:", err);
    }
  };

  const saveFitnesProgram = (event) => {
    event.preventDefault();
    console.log(fitProgram);

    if (validateInputs()) {
      console.log(fitProgram);

      if (fitProgram._id != 0) { //update fitness program       
        updateFitProgram();
      }
      else {
        createFitProgram();
      }
    }
  }

  const updateFitProgram = async () => {
    try {
      const data = await updateFitnessProgram(fitProgram, auth.token);
      if (data.success) {
        SetError("Fitness Program Updated Succesfully")
      } else {
        console.log(data);
        SetError(data);
      }
    } catch (err) {
      SetError("Something went wrong. Please try again.");
      console.error("Failed to update Fitness Program:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl m-2 mt-10">
      <h2 className="text-xl font-bold ml-5 mb-4">Create Fitness Program</h2>
      <form onSubmit={saveFitnesProgram} className="space-y-2 m-5 mb-10">
        {/* Plan Name */}
        <div>
          <label className="block" >Plan Name</label>
          <input type="text" name="name" value={fitProgram.name} onChange={handleChange} className="w-3/4 border rounded-sm p-1"
            required />
        </div>

        {/* Description */}
        <div>
          <label className="block">Description</label>
          <textarea name="description" value={fitProgram.description} onChange={handleChange} className="w-3/4 border rounded-sm p-1"
          />
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-2">
          <div>
            <label className="block">Price</label>
            <input type="number" name="price" value={fitProgram.price} onChange={handleChange} className="w-1/2 border rounded-sm p-1" required />
          </div>
          <div>
            <label className="block">Duration (days)</label>
            <input type="number" name="duration_days" value={fitProgram.duration_days} onChange={handleChange} className="w-1/2 border rounded-sm p-1" required />
          </div>
        </div>

        {/* Trainers Section */}
        <div>
          <h3 className="font-semibold mb-2">Trainers</h3>
          {fitProgram.features.trainers.map((trainer, index) => {
            // Filter out already selected types, but include the current trainer’s type
            const availableTypes = trainerTypes.filter(
              (t) =>
                !fitProgram.features.trainers.some(
                  (tr, i) => tr.trainer_type === t && i !== index
                )
            );

            return (
              <div key={index} className="flex items-center gap-4 mb-2 border-b pb-2" >
                <select value={trainer.trainer_type} onChange={(e) => handleTrainerChange(index, "trainer_type", e.target.value)}
                  className="border rounded-sm p-1">
                  <option value="">Select Trainer Type</option>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input type="number" value={trainer.count} onChange={(e) => handleTrainerChange(index, "count", e.target.value)}
                  className="border rounded-sm p-1 w-20" />

                <button type="button" onClick={() => handleRemoveTrainer(index)} className="text-red-500" >
                  ❌
                </button>
              </div>
            );
          })}

          <button type="button" onClick={handleAddTrainer} disabled={fitProgram.features.trainers.length >= trainerTypes.length}
            className={`mt-2 px-3 py-1 rounded ${fitProgram.features.trainers.length >= trainerTypes.length
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
              }`}
          >
            Add Trainer
          </button>
        </div>



        {/* Support Level */}
        <div>
          <label className="block ">Support Level</label>
          <select name="features.support_level" value={fitProgram.features.support_level} onChange={handleChange} className="w-3/4 border rounded-sm p-1" >
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Access options */}
        <div className="grid grid-cols-4 gap-4">
          <label className="flex gap-2 items-center">
            <input type="checkbox" name="features.diet_plan_access" checked={fitProgram.features.diet_plan_access} onChange={handleChange}
            />
            Diet Plan Access
          </label>
          <label className="flex gap-2 items-center">
            <input type="checkbox" name="features.workout_plan_access" checked={fitProgram.features.workout_plan_access} onChange={handleChange}
            />
            Workout Plan Access
          </label>
          <label className="flex gap-2 items-center">
            <input type="checkbox" name="features.yoga_plan_access" checked={fitProgram.features.yoga_plan_access} onChange={handleChange}
            />
            Yoga Plan Access
          </label>
        </div>

        {/* Status */}
        <div>
          <label className="block">Status</label>
          <select name="features.status" value={fitProgram.features.status} onChange={handleChange} className="w-3/4 border rounded-sm p-1"
          >
            <option value="Active">Active</option>
            <option value="Approved">Approved</option>
            <option value="InActive">InActive</option>
          </select>
        </div>

        {error.length > 0 &&
          <div>
            <span className='text-red-400 p-5'>{error}</span>
          </div>}

        {/* Submit */}
        <div className="mt-10 grid grid-cols-4 gap-4">
          <button
            type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Save Plan
          </button>
          <button className="border border-transparent bg-white hover:border-blue-500 hover:bg-blue-50 px-4 py-2 rounded transition" >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddFitnessProgramPage;
