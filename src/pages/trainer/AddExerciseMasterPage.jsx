import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Buttons";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Link, useParams } from "react-router-dom";
import { createExerciseMaster, fetchExerciseMasterWithId, updateExerciseMaster } from "../../api/trainer/exerciseMaster";
import { useSelector } from "react-redux";

const AddExerciseMasterPage = () => {
    const auth = useSelector((state) => state.auth)
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

    return (
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl m-2 mt-10">
            <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-3 items-center'>
                <h1 className='text-xl font-bold m-2 sm:m-0 '>{exerciseId ? "Edit Exercise" : "Add Exercise"}</h1>
                <Link to='/trainer/exercisemaster' >
                    <span className="rounded-md text-blue-600 font-bold px-4 py-1.5 hover:bg-blue-50 transition-colors">Manage ExerciseMaster</span></Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 mx-2 md:grid-cols-2 gap-4">
                <div className="mb-4 col-span-2">
                    <Input label="Exercise Name" name="name" value={exercise.name} onChange={handleChange}
                        placeholder="e.g., Push Ups" required />
                </div>
                <div className="mb-4 col-span-2">
                    <Textarea label="Description" name="description" value={exercise.description} onChange={handleChange}
                        placeholder="Brief description of the exercise" />
                </div>

                <div className="mb-4">
                    <Label>Exercise Type</Label>
                    <select name="exercise_type" value={exercise.exercise_type} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"  >
                        {["Strength", "Cardio", "HIIT", "Yoga", "Flexibility", "Mixed"].map(
                            (type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div className="mb-4">
                    <Label>Difficulty Level</Label>
                    <select
                        name="difficulty_level" value={exercise.difficulty_level} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" >
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <Label>MET</Label>
                    <Input label="MET (Metabolic Equivalent)" type="number" step="0.1" name="met" value={exercise.met}
                        onChange={handleChange} required placeholder="e.g., 8.0" />
                </div>

                <div className="mb-4">
                    <Label>Default Duration</Label>
                    <Input label="Default Duration (minutes)" type="number" name="default_duration_min"
                        value={exercise.default_duration_min} onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <Label>Rest Time (seconds)</Label>
                    <Input label="Rest Time (seconds)" type="number" name="rest_sec" value={exercise.rest_sec} onChange={handleChange} />
                </div>

                {errors && <p className="text-red-500 text-md text-center">{errors}</p>}

                <div className="mb-4 col-span-2">
                    <div className="flex justify-center pt-4">
                        <Button type="submit">{exerciseId ? "Update" : "Save"}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddExerciseMasterPage;

