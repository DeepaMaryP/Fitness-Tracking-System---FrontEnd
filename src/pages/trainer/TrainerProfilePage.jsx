import React, { useEffect, useState } from "react";
import { createUserProfile } from "../../api/user/userProfile";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTrainerWithUserId, updateTrainerProfile } from "../../api/admin/trainerProfile";

export default function TrainerProfilePage() {
    const [profile, setProfile] = useState({
        qualification: "",
        experience_years: "",
        specialization: "",
        certification: "",
        availability_status: "",
    });

    const [error, setError] = useState("");
    const auth = useSelector((state) => state.auth)

    const fetchProfile = async () => {
        try {
            const result = await fetchTrainerWithUserId(auth.userId, auth.token)
            console.log(result);

            if (result.success && result.data) {
                const profileData = result.data;
                setProfile(profileData)
            }
        } catch (err) {
            console.error("Error fetching UserProfile:", err)
            setError(`Error fetching UserProfile:${err}`)
        }
    };

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newForm = { ...profile, [name]: value };
        setProfile(newForm);
    };

    const validateTrainer = () => {
        const errors = [];
        if (profile.qualification.length == 0) {
            errors.push("Please enter Qualification")
        }
        if (profile.experience_years.length == 0) {
            errors.push("Please enter Experience")
        }
        if (profile.specialization.length == 0) {
            errors.push("Please enter Specialization")
        }
        if (profile.certification.length == 0) {
            errors.push("Please enter Certification")
        }
        if (profile.availability_status.length == 0) {
            errors.push("Please enter Availability Status")
        }
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateTrainer();
        if (errors.length > 0) {
            setError(errors.join("\n"))
            return;
        }

        try {
            const profileToSave = { ...profile, userId: auth.userId }
            const data = await updateTrainerProfile(profileToSave, auth.token);
            if (data.success) {
                console.log("Trainer Profile Updated Succesfully")
                setError("Trainer Profile Updated Succesfully")
            } else {
                console.log(data);
                setError(data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
            console.error("Failed to update Trainer Profile:", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl pb-5 mt-5">
            <h2 className="text-2xl font-bold text-center mb-2">Your Profile</h2>
            <form onSubmit={handleSubmit} >
                <div className="grid grid-cols-2 gap-4 p-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">Qualification</label>
                        <input name="qualification" value={profile.qualification} onChange={handleChange} className="w-full border rounded-md p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Specialization</label>
                        <input name="specialization" value={profile.specialization} onChange={handleChange} className="w-full border rounded-md p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                        <input type="number" name="experience_years" value={profile.experience_years} onChange={handleChange}
                            className="w-full border rounded-md p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Certification</label>
                        <input name="certification" value={profile.certification} onChange={handleChange} className="w-full border rounded-md p-2" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Availability</label>
                        <select name="availability_status" value={profile.availability_status} onChange={handleChange} className="w-full border rounded-md p-2" required >
                            <option value="">Select Availability</option>
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                        </select>
                    </div>
                </div>

                {error && <p className="text-red-500 text-md text-center">{error}</p>}
                <div className="flex justify-center">
                    <button type="submit" className=" w-30 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md mt-4" >
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
}
