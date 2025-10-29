import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllFoodMaster } from "../../api/trainer/foodMaster";
import { createDietPlan, fetchDietPlanWithId, updateDietPlan } from "../../api/trainer/dietPlan";

const AddDietPlanPage = () => {
    const auth = useSelector((state) => state.auth)
    const dietPlanId = useParams().id
    const navigate = useNavigate()

    const [foodList, setFoodList] = useState([]); // fetched from FoodMaster
    const [dietPlan, setDietPlan] = useState({
        _id: 0,
        plan_name: "",
        goal_type: "Custom",
        total_calories: 0,
        macros: { protein_g: 0, carbs_g: 0, fat_g: 0 },
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
                setFoodList(data);
            } catch (err) {
                console.error("Failed to load foods", err);
            }
        };
        fetchFoods();
        if (dietPlanId) {
            loadDietPlan();
        }
    }, []);

    const loadDietPlan = async () => {
        try {
            const result = await fetchDietPlanWithId(dietPlanId, auth.token)         
            if (result.data) {                
                setDietPlan(result.data)
            }
        } catch (err) {
            setErrors("Unable to get DietPlan details")
            console.error("Error fetching DietPlan:", err)
        }
    }

    // Handle field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDietPlan((prev) => ({ ...prev, [name]: value }));
    };

    //Recalculate total calories and macros
    const recalculateTotals = (plan) => {
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

        Object.values(plan.meals).forEach(meal => {
            meal.food_items.forEach(item => {
                totalCalories += item.calories || 0;
                totalProtein += item.protein_g || 0;
                totalCarbs += item.carbs_g || 0;
                totalFat += item.fat_g || 0;
            });
        });

        plan.total_calories = totalCalories;
        plan.macros = { protein_g: totalProtein, carbs_g: totalCarbs, fat_g: totalFat };
    };

    const handleQuantityChange = (meal, index, qty) => {
        const updated = { ...dietPlan };
        const item = updated.meals[meal].food_items[index];
        item.quantity = Number(qty) || 1;

        updateMacros(item);
        setDietPlan(updated);
        recalculateTotals(updated);
    };

    const handleUnitChange = (meal, index, newUnit) => {
        const updated = { ...dietPlan };
        const item = updated.meals[meal].food_items[index];
        item.unit = newUnit;

        updateMacros(item);
        setDietPlan(updated);
        recalculateTotals(updated);
    };

    const handleFoodChange = (meal, index, foodId) => {
        const selectedFood = foodList.find(f => f._id === foodId);
        if (!selectedFood) return;

        if (isFoodDuplicate(meal, foodId)) {
            alert("This food item is already added to " + meal);
            return; // stop update
        }

        const updated = { ...dietPlan };
        const item = updated.meals[meal].food_items[index];
        item.food_id = foodId;
        item.baseFood = selectedFood;
        item.unit = selectedFood.alternate_units?.[0]?.name || "g";
        item.quantity = 1;

        updateMacros(item);
        setDietPlan(updated);
        recalculateTotals(updated);
    };

    const updateMacros = (item) => {
        const food = item.baseFood;
        if (!food) return;

        const altUnit = food.alternate_units?.find(u => u.name === item.unit);
        const grams = altUnit ? altUnit.grams_equivalent : 100; // default 100g
        const factor = (grams / 100) * (item.quantity || 1);

        item.calories = food.calories * factor;
        item.protein_g = food.protein_g * factor;
        item.carbs_g = food.carbs_g * factor;
        item.fat_g = food.fat_g * factor;
    };


    // Handle adding food to a meal
    const handleAddFood = (meal) => {
        const newItem = {
            food_id: "",
            quantity: 1,
            unit: "",
            calories: 0,
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0,
            baseFood: null
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
        const updated = { ...dietPlan };
        updated.meals[meal].food_items.splice(index, 1);
        recalculateTotals(updated);
        setDietPlan(updated);
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
        } else {
            // Loop through each meal
            Object.keys(dietPlan.meals).forEach(mealName => {
                dietPlan.meals[mealName]?.food_items.forEach((item, index) => {
                    // // Check if food is selected
                    if (!item.food_id || item.food_id === "") {
                        valid = false;
                        if (!newErrors[mealName]) newErrors[mealName] = {};
                        newErrors[mealName][index] = "Please select a food item";
                    }
                    if (!item.quantity || item.quantity === "") {
                        valid = false;
                        if (!newErrors[mealName]) newErrors[mealName] = {};
                        newErrors[mealName][index] = "Please enter quantity";
                    }
                    if (!item.unit || item.unit === "") {
                        valid = false;
                        if (!newErrors[mealName]) newErrors[mealName] = {};
                        newErrors[mealName][index] = "Please select unit";
                    }
                    if (!item.calories || item.calories === "") {
                        valid = false;
                        if (!newErrors[mealName]) newErrors[mealName] = {};
                        newErrors[mealName][index] = "Please enter calories";
                    }
                });
            });
        }
        setErrors(newErrors);
        return valid;
    };

    const isFoodDuplicate = (mealName, selectedFoodId) => {
        const mealFoods = dietPlan.meals[mealName].food_items;
        return mealFoods.some(item => item.food_id === selectedFoodId);
    };

    const cancelAddPlan = () => {
        navigate("/trainer/dietplan")
    }

    const createDietPlanDetails = async () => {
        try {
            const data = await createDietPlan(dietPlan, auth.token);
            if (data.success) {
                setErrors("DietPlan Created Succesfully")
            } else {
                console.log(data);
                setErrors(data);
            }
        } catch (err) {
            setErrors("Something went wrong. Please try again.");
            console.error("Failed to create DietPlan:", err);
        }
    };

    const updateDietPlanDetails = async () => {
        try {
            const data = await updateDietPlan(dietPlan, auth.token);
            if (data.success) {
                setErrors("DietPlan Updated Succesfully")
            } else {
                console.log(data);
                setErrors(data);
            }
        } catch (err) {
            setErrors("Something went wrong. Please try again.");
            console.error("Failed to update DietPlan:", err);
        }
    };

    // Save diet plan
    const handleSave = async (event) => {
        event.preventDefault();
        if (!validateForm()) return

        if (dietPlan._id == 0) {
            createDietPlanDetails()
        } else {
            updateDietPlanDetails()
        }
    };

    // UI for a meal block
    const renderMealSection = (mealName) => (
        <div key={mealName} className="border rounded-lg p-4 bg-gray-50 mt-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{mealName}</h3>
                <button type="button" onClick={() => handleAddFood(mealName)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-sm hover:bg-blue-700" >
                    + Add Food
                </button>
            </div>

            {dietPlan.meals[mealName].food_items.length === 0 ? (
                <p className="text-gray-500 text-sm">No items added yet.</p>
            ) : (
                dietPlan.meals[mealName].food_items.map((item, index) => (
                    <div key={index} className="grid grid-cols-10 gap-1 mb-2 items-center bg-white border p-1 rounded-sm">
                        <div className="col-span-2">
                            <select value={item.food_id}
                                onChange={(e) => handleFoodChange(mealName, index, e.target.value)}
                                className="border rounded-sm p-1 w-full">
                                <option value="">Select Food</option>
                                {foodList?.map((food) => (
                                    <option key={food._id} value={food._id}>
                                        {food.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Unit */}
                        <div className="col-span-2">
                            <select value={item.unit} onChange={(e) => handleUnitChange(mealName, index, e.target.value)} className="border rounded-sm p-1 w-full">
                                <option value="">Select Unit</option>
                                {item.baseFood?.alternate_units?.map((u) => (
                                    <option key={u.name} value={u.name}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) =>
                            handleQuantityChange(mealName, index, e.target.value)} className="border rounded-sm p-1" />
                        <div className="col-span-1 text-center">{item.calories.toFixed(0)} kcal</div>
                        <div className="col-span-1 text-center">{item.protein_g.toFixed(1)} g</div>
                        <div className="col-span-1 text-center">{item.carbs_g.toFixed(1)} g</div>
                        <div className="col-span-1 text-center">{item.fat_g.toFixed(1)} g</div>
                        <button type="button" onClick={() => handleRemoveFood(mealName, index)}
                            className="bg-red-500 text-white px-3 py-1 rounded-sm hover:bg-red-600" >
                            ✕
                        </button>
                        {/* Inline error display */}
                        {errors[mealName] && errors[mealName][index] && (
                            <span className="text-red-500 text-sm">
                                {errors[mealName][index]}
                            </span>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow">
            <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-3 items-center'>
                <h1 className='text-xl font-bold m-2 sm:m-0 '>Create Diet Plan</h1>
                <Link to='/trainer/dietplan' >
                    <span className="rounded-sm text-blue-600 font-bold px-4 py-1.5 hover:bg-blue-50 transition-colors">Manage Diet Plans</span></Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-medium">Plan Name *</label>
                    <input type="text" name="plan_name" value={dietPlan.plan_name} onChange={handleChange} className="border rounded-sm w-full p-1" />
                    {errors.plan_name && (
                        <p className="text-red-500 text-sm">{errors.plan_name}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Goal Type</label>
                    <select name="goal_type" value={dietPlan.goal_type} onChange={handleChange} className="border rounded-sm w-full p-1" >
                        <option>Weight Loss</option>
                        <option>Weight Gain</option>
                        <option>Maintain</option>
                        <option>Custom</option>
                    </select>
                </div>
            </div>

            {/* Meals Sections */}
            {["Breakfast", "Lunch", "Snack", "Dinner",].map(renderMealSection)}

            {/* Totals */}
            <div className="border-t pt-4 mt-6 text-right font-medium">
                Total Calories: {dietPlan.total_calories.toFixed(0)} kcal &nbsp;|&nbsp;
                Protein: {dietPlan.macros.protein_g.toFixed(1)} g &nbsp;|&nbsp;
                Carbs: {dietPlan.macros.carbs_g.toFixed(1)} g &nbsp;|&nbsp;
                Fat: {dietPlan.macros.fat_g.toFixed(1)} g
            </div>
            {errors.total_calories && (
                <p className="text-red-500 text-sm">{errors.total_calories}</p>
            )}


            <div className="flex justify-center mt-6 gap-4">
                <button type="button" onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded-sm hover:bg-blue-700 font-semibold" >
                    Save Plan
                </button>
                <button type="button" className="border border-transparent bg-white hover:border-blue-500 hover:bg-blue-50 px-6 py-2 rounded transition " onClick={cancelAddPlan}>
                    Cancel
                </button>
                {errors.length > 0 &&
                    <div>
                        <span className='text-red-400 p-5'>{errors}</span>
                    </div>}
            </div>
        </div>
    );
};


export default AddDietPlanPage
