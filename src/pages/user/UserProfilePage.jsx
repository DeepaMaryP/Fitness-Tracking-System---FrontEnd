import React, { useEffect, useState } from "react";
import { createUserProfile, fetchUserProfileWithId } from "../../api/user/userProfile";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function UserProfilePage({ onProfileSaved }) {
  const [profile, setProfile] = useState({
    dob: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
  });

  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [error, setError] = useState("");
  const auth = useSelector((state) => state.auth)
  const userId = useParams().id

  const fetchProfile = async () => {
    try {
      const result = await fetchUserProfileWithId(userId, auth.token)
      if (result.success && result.data) {
        const profileData = result.data;
        if (profileData.dob) {
          profileData.dob = new Date(profileData.dob).toISOString().split("T")[0];
          setProfile(profileData)
        }
      }
    } catch (err) {
      console.error("Error fetching UserProfile:", err)
      setError(`Error fetching UserProfile:${err}`)
    }
  };

  useEffect(() => {
    if (userId)
      fetchProfile()
  }, [])

  // Calculate BMI and determine category
  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightM = height / 100;
      const bmiValue = (weight / (heightM * heightM)).toFixed(1);
      setBmi(bmiValue);

      let category = "";
      if (bmiValue < 18.5) category = "Underweight";
      else if (bmiValue < 24.9) category = "Normal weight";
      else if (bmiValue < 29.9) category = "Overweight";
      else category = "Obese";
      setBmiCategory(category);
    } else {
      setBmi(null);
      setBmiCategory("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...profile, [name]: value };
    setProfile(newForm);
    if (name === "height_cm" || name === "weight_kg") {
      calculateBMI(newForm.height_cm, newForm.weight_kg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bmi) return setError("Please enter valid height and weight to calculate BMI.");

    try {
      const profileToSave = { ...profile, userId: auth.userId, subscription_status: "unpaid" }
      const data = await createUserProfile(profileToSave, auth.token);
      if (data.success) {
        console.log("User Profile Created Succesfully")
        onProfileSaved?.();
      } else {
        console.log(data);
        setError(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      console.error("Failed to create Fitness Program:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-center mb-2">Complete Your Profile</h2>
      <p className="text-center text-gray-600 mb-6">
        We need these details to calculate your BMI and personalize your fitness experience.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="w-full border rounded-md p-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select name="gender" value={profile.gender} onChange={handleChange} className="w-full border rounded-md p-2" required >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input type="number" name="height_cm" value={profile.height_cm} onChange={handleChange} className="w-full border rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input type="number" name="weight_kg" value={profile.weight_kg} onChange={handleChange}
              className="w-full border rounded-md p-2" required />
          </div>
        </div>

        {bmi && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center mt-4">
            <p className="text-gray-700">
              Your <strong>BMI</strong> is{" "}
              <span className="font-semibold text-blue-700">{bmi}</span>
            </p>
            <p
              className={`mt-1 font-medium ${bmiCategory === "Underweight"
                ? "text-yellow-600"
                : bmiCategory === "Normal weight"
                  ? "text-green-600"
                  : bmiCategory === "Overweight"
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
            >
              {bmiCategory}
            </p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md mt-4"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
