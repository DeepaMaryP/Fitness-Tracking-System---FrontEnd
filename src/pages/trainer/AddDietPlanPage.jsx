import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllFoodMaster } from "../../api/admin/foodMaster";

const AddDietPlanPage = () => {
    const auth = useSelector((state) => state.auth)
    const dietPlanId = useParams().id
    const navigate = useNavigate()

    const [foodList, setFoodList] = useState([]); // fetched from FoodMaster
    const [dietPlan, setDietPlan] = useState({
        plan_name: "",
        goal_type: "Custom",
        total_calories: "",
        macros: { protein_g: "", carbs_g: "", fat_g: "" },
        meals: {
            Breakfast: { food_items: [] },
            Lunch: { food_items: [] },
            Dinner: { food_items: [] },
            Snack: { food_items: [] },
        },
    });
    const [errors, setErrors] = useState({});

    // Fetch food list (FoodMaster)
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const data = await fetchAllFoodMaster(auth.token)
                console.log(data);

                setFoodList(data);
            } catch (err) {
                console.error("Failed to load foods", err);
            }
        };
        fetchFoods();
    }, []);

    // Handle field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDietPlan((prev) => ({ ...prev, [name]: value }));
    };

    // Handle macro change
    const handleMacroChange = (e) => {
        const { name, value } = e.target;
        setDietPlan((prev) => ({
            ...prev,
            macros: { ...prev.macros, [name]: value },
        }));
    };

    // Handle adding food to a meal
    const handleAddFood = (meal) => {
        const newItem = {
            food_id: "",
            quantity: "",
            unit: "g",
            calories: "",
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0,
        };
        setDietPlan((prev) => ({
            ...prev,
            meals: {
                ...prev.meals,
                [meal]: {
                    food_items: [...prev.meals[meal].food_items, newItem],
                },
            },
        }));
    };

    // Handle removing food item
    const handleRemoveFood = (meal, index) => {
        setDietPlan((prev) => ({
            ...prev,
            meals: {
                ...prev.meals,
                [meal]: {
                    food_items: prev.meals[meal].food_items.filter((_, i) => i !== index),
                },
            },
        }));
    };

    //  Handle food item change
    const handleFoodChange = (meal, index, field, value) => {
        const updatedFoods = dietPlan.meals[meal].food_items.map((f, i) =>
            i === index ? { ...f, [field]: value } : f
        );
        setDietPlan((prev) => ({
            ...prev,
            meals: { ...prev.meals, [meal]: { food_items: updatedFoods } },
        }));
    };

    // Validate
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (!dietPlan.plan_name.trim()) {
            newErrors.plan_name = "Plan name is required";
            valid = false;
        }
        if (!dietPlan.total_calories || dietPlan.total_calories <= 0) {
            newErrors.total_calories = "Total calories must be greater than 0";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

     const cancelAddPlan = () => {
        navigate("/admin/dietplan")
    }

    // Save diet plan
    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            console.log("Diet Plan Data:", dietPlan);
            // await axios.post("/api/diet-plans", dietPlan);
            alert("Diet plan saved successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    // UI for a meal block
    const renderMealSection = (mealName) => (
        <div key={mealName} className="border rounded-lg p-4 bg-gray-50 mt-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{mealName}</h3>
                <button type="button" onClick={() => handleAddFood(mealName)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700" >
                    + Add Food
                </button>
            </div>

            {dietPlan.meals[mealName].food_items.length === 0 ? (
                <p className="text-gray-500 text-sm">No items added yet.</p>
            ) : (
                dietPlan.meals[mealName].food_items.map((item, index) => (
                    <div key={index}
                        className="grid grid-cols-7 gap-2 mb-2 items-center bg-white border p-2 rounded-md">
                        <select value={item.food_id} onChange={(e) => handleFoodChange(mealName, index, "food_id", e.target.value)}
                            className="border rounded-md p-2 col-span-2">
                            <option value="">Select Food</option>
                            {foodList?.map((food) => (
                                <option key={food._id} value={food._id}>
                                    {food.name}
                                </option>
                            ))}
                        </select>

                        <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) =>
                            handleFoodChange(mealName, index, "quantity", e.target.value)} className="border rounded-md p-2" />
                        <input type="text" placeholder="Unit" value={item.unit} onChange={(e) =>
                            handleFoodChange(mealName, index, "unit", e.target.value)} className="border rounded-md p-2" />
                        <input type="number" placeholder="Calories" value={item.calories} onChange={(e) =>
                            handleFoodChange(mealName, index, "calories", e.target.value)} className="border rounded-md p-2" />
                        <input type="number" placeholder="Protein" value={item.protein_g} onChange={(e) =>
                            handleFoodChange(mealName, index, "protein_g", e.target.value)} className="border rounded-md p-2" />
                        <input type="number" placeholder="Carbs" value={item.carbs_g} onChange={(e) => handleFoodChange(mealName, index, "carbs_g", e.target.value)}
                            className="border rounded-md p-2" />
                        <button type="button" onClick={() => handleRemoveFood(mealName, index)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" >
                            ✕
                        </button>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow">
            <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-3 items-center'>
                <h1 className='text-xl font-bold m-2 sm:m-0 '>Create Diet Plan</h1>
                <Link to='/admin/dietplan' >
                    <span className="rounded-md text-blue-600 font-bold px-4 py-1.5 hover:bg-blue-50 transition-colors">Manage Diet Plans</span></Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-medium">Plan Name *</label>
                    <input type="text" name="plan_name" value={dietPlan.plan_name} onChange={handleChange} className="border rounded-md w-full p-2" />
                    {errors.plan_name && (
                        <p className="text-red-500 text-sm">{errors.plan_name}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Goal Type</label>
                    <select name="goal_type" value={dietPlan.goal_type} onChange={handleChange} className="border rounded-md w-full p-2" >
                        <option>Weight Loss</option>
                        <option>Weight Gain</option>
                        <option>Maintain</option>
                        <option>Custom</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Total Calories *</label>
                    <input
                        type="number" name="total_calories" value={dietPlan.total_calories} onChange={handleChange} className="border rounded-md w-full p-2" />
                    {errors.total_calories && (
                        <p className="text-red-500 text-sm">{errors.total_calories}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Protein (g)</label>
                    <input type="number" name="protein_g" value={dietPlan.macros.protein_g} onChange={handleMacroChange}
                        className="border rounded-md w-full p-2" />
                </div>

                <div>
                    <label className="block font-medium">Carbs (g)</label>
                    <input type="number" name="carbs_g" value={dietPlan.macros.carbs_g} onChange={handleMacroChange} className="border rounded-md w-full p-2" />
                </div>

                <div>
                    <label className="block font-medium">Fat (g)</label>
                    <input type="number" name="fat_g" value={dietPlan.macros.fat_g} onChange={handleMacroChange} className="border rounded-md w-full p-2" />
                </div>
            </div>

            {/* Meals Sections */}
            {["Breakfast", "Lunch", "Dinner", "Snack"].map(renderMealSection)}

            <div className="flex justify-center mt-6 gap-4">
                <button  type="button" onClick={handleSave}
                   className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold" >
                    Save Plan
                </button>
                <button type="button" className="border border-transparent bg-white hover:border-blue-500 hover:bg-blue-50 px-6 py-2 rounded transition " onClick={cancelAddPlan}>
                    Cancel
                </button>
            </div>
        </div>
    );
};


export default AddDietPlanPage
