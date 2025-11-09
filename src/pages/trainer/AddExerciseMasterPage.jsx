import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { createExerciseMaster, fetchExerciseMasterWithId, updateExerciseMaster } from "../../api/trainer/exerciseMaster";

const AddExerciseMasterPage = () => {
    const auth = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const exerciseId = useParams().id
    const [errors, setErrors] = useState("");

    const [exercise, setExercise] = useState({
        name: "",
        description: "",
        exercise_type: "Strength",
        difficulty_level: "Beginner",
        met: "",
        default_duration_min: 10,
        rest_sec: 60,
        media_url: "",
    });

    useEffect(() => {
        if (exerciseId) {
            loadExerciseMaster();
        }
    }, []);

    const loadExerciseMaster = async () => {
        try {
            const data = await fetchExerciseMasterWithId(exerciseId, auth.token)
            setExercise(data)
        } catch (err) {
            setErrors("Unable to get ExerciseMaster details")
            console.error("Error fetching ExerciseMaster:", err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExercise({ ...exercise, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!exercise.name) newErrors.push("Please enter Name");
        if (!exercise.met) newErrors.push("Please enter MET");
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (errors.length > 0) {
            setErrors(errors.join("\n"))
            return;
        }
        try {
            const data = exerciseId ? await updateExerciseMaster(exercise, auth.token) :
                await createExerciseMaster(exercise, auth.token)
            if (data.success) {
                const message = exerciseId ? 'updated' : 'created'
                setErrors(`ExerciseMaster ${message} Succesfully`)
            } else {
                console.log(data);
                setErrors(data);
            }

        } catch (err) {
            setErrors("Something went wrong. Please try again.");
            console.error("Failed to create ExerciseMaster:", err);
        }
    };

    const cancelAddExercise = () => {
        navigate("/trainer/exercisemaster")
    }

   return (
  <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl m-3 sm:m-5 mt-10 p-4 sm:p-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-6 gap-3">
      <h1 className="text-2xl font-bold text-center sm:text-left">
        {exerciseId ? "Edit Exercise" : "Add Exercise"}
      </h1>
      <Link to="/trainer/exercisemaster">
        <span className="rounded-md text-blue-600 font-semibold px-4 py-2 border border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all">
          Manage ExerciseMaster
        </span>
      </Link>
    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
    >
      {/* Exercise Name */}
      <div className="md:col-span-2">
        <Input
          label="Exercise Name"
          name="name"
          value={exercise.name}
          onChange={handleChange}
          placeholder="e.g., Push Ups"
          required
        />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <Textarea
          label="Description"
          name="description"
          value={exercise.description}
          onChange={handleChange}
          placeholder="Brief description of the exercise"
        />
      </div>

      {/* Exercise Type */}
      <div>
        <Label>Exercise Type</Label>
        <select
          name="exercise_type"
          value={exercise.exercise_type}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {["Strength", "Cardio", "HIIT", "Yoga", "Flexibility", "Mixed"].map(
            (type) => (
              <option key={type} value={type}>
                {type}
              </option>
            )
          )}
        </select>
      </div>

      {/* Difficulty Level */}
      <div>
        <Label>Difficulty Level</Label>
        <select
          name="difficulty_level"
          value={exercise.difficulty_level}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* MET */}
      <div>
        <Label>MET</Label>
        <Input
          label="MET (Metabolic Equivalent)"
          type="number"
          step="0.1"
          name="met"
          value={exercise.met}
          onChange={handleChange}
          required
          placeholder="e.g., 8.0"
        />
      </div>

      {/* Default Duration */}
      <div>
        <Label>Default Duration (minutes)</Label>
        <Input
          type="number"
          name="default_duration_min"
          value={exercise.default_duration_min}
          onChange={handleChange}
        />
      </div>

      {/* Rest Time */}
      <div>
        <Label>Rest Time (seconds)</Label>
        <Input
          type="number"
          name="rest_sec"
          value={exercise.rest_sec}
          onChange={handleChange}
        />
      </div>

      {/* Error message */}
      {errors && (
        <p className="text-red-500 text-md text-center md:col-span-2">
          {errors}
        </p>
      )}

      {/* Buttons */}
      <div className="md:col-span-2 mt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-md font-semibold text-white shadow hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
        >
          Save
        </button>
        <button
          type="button"
          onClick={cancelAddExercise}
          className="border border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 px-5 py-2 rounded-md transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
);

};

export default AddExerciseMasterPage;

