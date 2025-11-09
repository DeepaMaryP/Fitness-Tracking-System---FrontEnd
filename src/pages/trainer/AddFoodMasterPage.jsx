import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { createFoodMaster, fetchFoodMasterWithId, updateFoodMaster } from '../../api/trainer/foodMaster';

function AddFoodMasterPage() {
    const auth = useSelector((state) => state.auth)
    const foodId = useParams().id
    const navigate = useNavigate()
    const [foodMaster, SetFoodMaster] = useState({
        _id: 0,
        name: "",
        category: "",
        serving_size: "",
        serving_unit: "",
        calories: "",
        protein_g: "",
        carbs_g: "",
        fat_g: "",
        fiber_g: "",
        sugar_g: "",
        alternate_units: [{ unit_name: "", grams_equivalent: "" }]
    });

    const loadFoodMaster = async () => {
        try {
            const data = await fetchFoodMasterWithId(foodId, auth.token)
            SetFoodMaster(data)
        } catch (err) {
            setErrors("Unable to get FoodMaster details")
            console.error("Error fetching FoodMaster:", err)
        }
    }

    useEffect(() => {
        if (foodId) {
            loadFoodMaster();
        }
    }, [])

    // Basic validation
    const validate = () => {
        const newErrors = {};
        if (!foodMaster.name) newErrors.name = "Name is required";
        if (!foodMaster.category) newErrors.category = "Category is required";
        if (!foodMaster.serving_size) newErrors.serving_size = "Serving size required";
        if (!foodMaster.serving_unit) newErrors.serving_unit = "Serving unit required";
        if (!foodMaster.calories) newErrors.calories = "Calories required";
        if (!foodMaster.protein_g) newErrors.protein_g = "Protein required";
        if (!foodMaster.carbs_g) newErrors.carbs_g = "Carbs required";
        return newErrors;
    };

    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        SetFoodMaster({ ...foodMaster, [name]: value });
    };

    const handleAlternateChange = (index, field, value) => {
        const newUnits = [...foodMaster.alternate_units];
        newUnits[index][field] = value;
        SetFoodMaster({ ...foodMaster, alternate_units: newUnits });
    };

    const addAlternateUnit = () => {
        SetFoodMaster({
            ...foodMaster,
            alternate_units: [...foodMaster.alternate_units, { unit_name: "", grams_equivalent: ""}]
        });
    };

    const removeAlternateUnit = (index) => {
        SetFoodMaster({
            ...foodMaster,
            alternate_units: foodMaster.alternate_units.filter((_, i) => i !== index)
        });
    };

    const createFoodMasterDetails = async () => {
        try {
            const data = await createFoodMaster(foodMaster, auth.token);
            if (data.success) {
                setErrors("FoodMaster Created Succesfully")
            } else {
                console.log(data);
                setErrors(data);
            }
        } catch (err) {
            setErrors("Something went wrong. Please try again.");
            console.error("Failed to create FoodMaster:", err);
        }
    };

    const updateFoodMasterDetails = async () => {
        try {
            const data = await updateFoodMaster(foodMaster, auth.token);
            if (data.success) {
                setErrors("FoodMaster Updated Succesfully")
            } else {
                console.log(data);
                setErrors(data);
            }
        } catch (err) {
            setErrors("Something went wrong. Please try again.");
            console.error("Failed to update FoodMaster:", err);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (foodMaster._id == 0) {
            createFoodMasterDetails()
        } else {
            updateFoodMasterDetails()
        }
    };

    const cancelAddFood = () => {
        navigate("/trainer/foodmaster")
    }

    return (
  <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl m-3 sm:m-5 mt-10 p-4 sm:p-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-6 gap-3">
      <h1 className="text-2xl font-bold text-center sm:text-left">
        Create Food Item
      </h1>
      <Link to="/trainer/foodmaster">
        <span className="rounded-md text-blue-600 font-semibold px-4 py-2 border border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all">
          Manage FoodMaster
        </span>
      </Link>
    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={foodMaster.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Apple"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={foodMaster.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Fruit"
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
      </div>

      {/* Serving Size */}
      <div>
        <label className="block text-sm font-medium mb-1">Serving Size</label>
        <input
          type="number"
          step="0.01"
          name="serving_size"
          value={foodMaster.serving_size}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.serving_size && (
          <p className="text-red-500 text-xs mt-1">{errors.serving_size}</p>
        )}
      </div>

      {/* Serving Unit */}
      <div>
        <label className="block text-sm font-medium mb-1">Serving Unit</label>
        <input
          type="text"
          name="serving_unit"
          value={foodMaster.serving_unit}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., grams, cup"
        />
        {errors.serving_unit && (
          <p className="text-red-500 text-xs mt-1">{errors.serving_unit}</p>
        )}
      </div>

      {/* Calories */}
      <div>
        <label className="block text-sm font-medium mb-1">Calories</label>
        <input
          type="number"
          step="0.01"
          name="calories"
          value={foodMaster.calories}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.calories && (
          <p className="text-red-500 text-xs mt-1">{errors.calories}</p>
        )}
      </div>

      {/* Protein */}
      <div>
        <label className="block text-sm font-medium mb-1">Protein (g)</label>
        <input
          type="number"
          step="0.01"
          name="protein_g"
          value={foodMaster.protein_g}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.protein_g && (
          <p className="text-red-500 text-xs mt-1">{errors.protein_g}</p>
        )}
      </div>

      {/* Carbs */}
      <div>
        <label className="block text-sm font-medium mb-1">Carbs (g)</label>
        <input
          type="number"
          step="0.01"
          name="carbs_g"
          value={foodMaster.carbs_g}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.carbs_g && (
          <p className="text-red-500 text-xs mt-1">{errors.carbs_g}</p>
        )}
      </div>

      {/* Fat */}
      <div>
        <label className="block text-sm font-medium mb-1">Fat (g)</label>
        <input
          type="number"
          step="0.01"
          name="fat_g"
          value={foodMaster.fat_g}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fiber */}
      <div>
        <label className="block text-sm font-medium mb-1">Fiber (g)</label>
        <input
          type="number"
          step="0.01"
          name="fiber_g"
          value={foodMaster.fiber_g}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sugar */}
      <div>
        <label className="block text-sm font-medium mb-1">Sugar (g)</label>
        <input
          type="number"
          step="0.01"
          name="sugar_g"
          value={foodMaster.sugar_g}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Alternate Units */}
      <div className="md:col-span-2">
        <h3 className="font-medium mt-4 mb-2">Alternate Units</h3>
        <div className="space-y-2">
          {foodMaster.alternate_units.map((unit, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center bg-gray-50 border p-2 rounded-md"
            >
              <input
                placeholder="Unit name (e.g., cup)"
                value={unit.name}
                onChange={(e) =>
                  handleAlternateChange(index, "name", e.target.value)
                }
                className="border p-2 rounded-md w-full sm:w-1/3"
              />
              <input
                type="number"
                placeholder="Grams equivalent"
                value={unit.grams_equivalent}
                onChange={(e) =>
                  handleAlternateChange(index, "grams_equivalent", e.target.value)
                }
                className="border p-2 rounded-md w-full sm:w-1/3"
              />
              <button
                type="button"
                onClick={() => removeAlternateUnit(index)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 w-full sm:w-auto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAlternateUnit}
          className="bg-blue-600 text-white px-3 py-1 rounded-md mt-2 hover:bg-blue-700"
        >
          + Add Alternate Unit
        </button>
      </div>

      {/* Submit Buttons */}
      <div className="md:col-span-2 mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-md font-semibold text-white shadow hover:bg-blue-500 transition-all"
        >
          Save
        </button>
        <button
          type="button"
          className="border border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 px-5 py-2 rounded-md transition-all"
          onClick={cancelAddFood}
        >
          Cancel
        </button>
      </div>

      {/* Error Section */}
      {errors.length > 0 && (
        <div className="md:col-span-2">
          <span className="text-red-400 block text-center p-4">{errors}</span>
        </div>
      )}
    </form>
  </div>
);

}

export default AddFoodMasterPage

