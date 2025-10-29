import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import food from "../../assets/Food.jpg";
import { fetchAllFoodMaster } from "../../api/trainer/foodMaster";
import { fetchTargetGoalWithUserId } from "../../api/user/targetGoal";
import { createFoodTracker, fetchTodaysFoodTrackerWithUserId } from "../../api/user/foodtracker";
import { fetchUserDietPlan } from "../../api/trainer/userDietPlan";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const unitsList = [
  { name: "g", multiplier: 1 },
  { name: "ml", multiplier: 1 },
  { name: "cup", multiplier: 240 },
  { name: "tbsp", multiplier: 15 },
  { name: "tsp", multiplier: 5 },
  { name: "bowl", multiplier: 250 },
  { name: "piece", multiplier: 50 },
];

const MealTracker = () => {
  const [meals, setMeals] = useState(
    mealTypes?.map((meal) => ({ meal_type: meal, food_items: [] }))
  );

  const [allFoods, setAllFoods] = useState([]);
  const [dietPlan, setDietPlan] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMealIndex, setActiveMealIndex] = useState(null);
  const [newFood, setNewFood] = useState({ name: "", ingredients: [] });
  const [targetGoal, setTargetGoal] = useState(null);
  const auth = useSelector((state) => state.auth);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoodMaster();
    fetchGoal();
    fetchDietPlan();
    fetchTodaysFoodTracker();
  }, []);

  const fetchFoodMaster = async () => {
    try {
      const data = await fetchAllFoodMaster(auth.token);
      setAllFoods(data);
    } catch (err) {
      console.error("Error fetching FoodMaster:", err);
    }
  };

  const fetchGoal = async () => {
    try {
      const res = await fetchTargetGoalWithUserId(auth.userId, auth.token);
      setTargetGoal(res.data);
    } catch (err) {
      console.warn("No target goal found");
      setTargetGoal(null);
    }
  };

  const fetchDietPlan = async () => {
    try {
      const result = await fetchUserDietPlan(auth.userId, auth.token);
      if (result.success && result.data) {       
        setDietPlan(result.data)
      }
    } catch (err) {
      console.error("Error fetching Diet plan:", err);
    }
  };

  const fetchTodaysFoodTracker = async () => {
    try {
      const result = await fetchTodaysFoodTrackerWithUserId(auth.userId, auth.token);
      if (result.success && result.data) {
        const existingMeals = result.data.meals.map(meal => ({
          ...meal,
          food_items: meal.food_items.map(item => ({
            ...item,
            name: item.food_id.name,
            base_nutrition: {
              calories: item.calories ?? 0,
              protein_g: item.protein_g ?? 0,
              carbs_g: item.carbs_g ?? 0,
              fat_g: item.fat_g ?? 0,
            }
          }))
        }))
        setMeals(existingMeals)
      }
    } catch (err) {
      console.warn("No Food tracker found");
      setMeals(mealTypes?.map((meal) => ({ meal_type: meal, food_items: [] })))
    }
  };

  const handleAddFood = (mealIndex, food) => {
    const updated = [...meals];
    const newFoodItem = {
      food_id: food._id,
      name: food.name,
      quantity: 1,
      unit: "g",
      base_nutrition: {
        calories: food.calories,
        protein_g: food.protein_g,
        carbs_g: food.carbs_g,
        fat_g: food.fat_g,
      },
    };

    updated[mealIndex].food_items.push(newFoodItem);

    // Check overconsumption before confirming add
    const projectedCalories =
      totalDayNutrition.calories + newFoodItem.base_nutrition.calories;
    if (
      targetGoal &&
      projectedCalories > targetGoal.daily_calorie_target * 1.2
    ) {
      const confirmContinue = window.confirm(
        "⚠️ Your calorie intake is higher than your target. Do you want to continue?"
      );
      if (!confirmContinue) return;
    }

    setMeals(updated);
    setSearchTerm("");
    setActiveMealIndex(null);
  };

  const handleRemoveFood = (mealIndex, foodIndex) => {
    const updated = [...meals];
    updated[mealIndex].food_items.splice(foodIndex, 1);
    setMeals(updated);
  };

  const handleChange = (mealIndex, foodIndex, field, value) => {
    const updated = [...meals];
    updated[mealIndex].food_items[foodIndex][field] = value;
    setMeals(updated);
  };

  const calcNutrition = (food) => {
    const unitMultiplier =
      unitsList.find((u) => u.name === food.unit)?.multiplier || 1;
    const factor = (food.quantity * unitMultiplier) / 100; // nutrition per 100g
    const b = food.base_nutrition;
    return {
      calories: +(b.calories * factor).toFixed(1),
      protein_g: +(b.protein_g * factor).toFixed(1),
      carbs_g: +(b.carbs_g * factor).toFixed(1),
      fat_g: +(b.fat_g * factor).toFixed(1),
    };
  };

  const mealTotals = (meal) => {
    return meal.food_items.reduce(
      (acc, f) => {
        const n = calcNutrition(f);
        acc.calories += n.calories;
        acc.protein_g += n.protein_g;
        acc.carbs_g += n.carbs_g;
        acc.fat_g += n.fat_g;
        return acc;
      },
      { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
    );
  };

  const totalDayNutrition = meals.reduce(
    (acc, m) => {
      const t = mealTotals(m);
      acc.calories += t.calories;
      acc.protein_g += t.protein_g;
      acc.carbs_g += t.carbs_g;
      acc.fat_g += t.fat_g;
      return acc;
    },
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );

  const handleAddNewFoodToDB = async () => {
    if (!newFood.name) return alert("Enter food name");
    await axios.post("/api/food/add", newFood);
    alert("Food submitted for approval");
    setNewFood({ name: "", ingredients: [] });
    fetchFoodMaster();
  };

  const validateFoodTracker = (tracker) => {
    const errors = [];

    if (!tracker.userId) {
      errors.push("User ID is missing.");
    }

    const hasAnyFood = !!tracker?.meals?.some(
      (meal) => meal.food_items && meal.food_items.length > 0
    );

    if (!hasAnyFood) {
      errors.push("Please add at least one food item in any meal before saving.");
      return errors;
    }

    if (!tracker.meals || tracker.meals.length === 0) {
      errors.push("At least one meal entry is required.");
    } else {
      tracker.meals.forEach((meal, mealIndex) => {
        if (!meal.meal_type) {
          errors.push(`Meal type is missing at index ${mealIndex}.`);
        }

        // Skip validation if user hasn't added anything yet
        if (!meal.food_items || meal.food_items.length === 0) return;

        meal.food_items.forEach((food, foodIndex) => {
          if (!food.food_id && !food.food_name) {
            errors.push(`Food name or ID missing in ${meal.meal_type} (row ${foodIndex + 1}).`);
          }

          if (food.quantity === undefined || food.quantity <= 0) {
            errors.push(`Quantity must be greater than 0 in ${meal.meal_type} (${food.food_name || "food"})`);
          }

          if (!food.unit) {
            errors.push(`Unit missing in ${meal.meal_type} (${food.food_name || "food"})`);
          }

          if (food.calories === undefined || food.calories < 0) {
            errors.push(`Calories missing or invalid in ${meal.meal_type} (${food.food_name || "food"})`);
          }
        });
      });
    }

    return errors;
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    try {

      // Final object to send to backend
      const foodTracker = {
        userId: auth.userId,
        date: new Date().toISOString(),
        meals: meals.map(meal => ({
          ...meal,
          food_items: meal.food_items.map(item => ({
            ...item,
            calories: item.base_nutrition?.calories ?? item.calories ?? 0,
            protein_g: item.base_nutrition?.protein_g ?? item.protein_g ?? 0,
            carbs_g: item.base_nutrition?.carbs_g ?? item.carbs_g ?? 0,
            fat_g: item.base_nutrition?.fat_g ?? item.fat_g ?? 0,
          }))
        })),
        total_calories: totalDayNutrition.calories,
        total_protein_g: totalDayNutrition.protein_g.toFixed(1),
        total_carbs_g: totalDayNutrition.carbs_g.toFixed(1),
        total_fat_g: totalDayNutrition.fat_g.toFixed(1)
      };

      const errors = validateFoodTracker(foodTracker);
      if (errors.length > 0) {
        setError(errors.join("\n"))
        return;
      }

      const data = await createFoodTracker(foodTracker, auth.token)
      if (data.success) {
        console.log("Meal Tracked Succesfully")
        setError("Meal Tracked Succesfully")
      } else {
        setError(data);
      }
    } catch (err) {
      console.error("Error in Meal Tracking:", err);
      setError(err.response?.data?.message || "Failed to Track Meal");
    }
  }

  return (
    <div className="p-6 pl-2 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center py-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="rounded-full w-10 h-10 flex items-center justify-center">
            <img src={food} className="rounded-full h-full w-full" alt="" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Track Food</h1>
        </div>

        {/* Total for the day */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-800 mb-2 mr-4">
            Total Calories Consumed Today
            <div>
              <label className="block text-sm font-medium mb-1 mt-2 text-red-600">Diet Plan</label>
              <Link to={`/user/userdietplanview/${dietPlan?.diet_plan_id?._id}`}>
                <span className="text-blue-400">{dietPlan?.diet_plan_id?.plan_name}</span> </Link>
            </div>           
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg shadow-sm p-3 text-center">
            <h2 className="text-lg font-semibold text-blue-700 mb-1">
              {dietPlan
                ? `🎯 Target: ${dietPlan.diet_plan_id?.total_calories} kcal`
                : 
              (targetGoal
                ? `🎯 Target: ${targetGoal.daily_calorie_target} kcal`
                : "🎯 No Target Set")}
            </h2>
            <p className="text-gray-700">
              <strong>{totalDayNutrition.calories.toFixed(1)}</strong> kcal | Protein:{" "}
              {totalDayNutrition.protein_g.toFixed(1)} g | Carbs:{" "}
              {totalDayNutrition.carbs_g.toFixed(1)} g | Fat:{" "}
              {totalDayNutrition.fat_g.toFixed(1)} g
            </p>
          </div>
        </div>

      </div>

      {/* Upgrade Prompt */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-md p-3 mb-6 flex justify-between items-center">
        <span className="text-gray-800 font-medium">
          🚀 Achieve your target faster with personalized plans and trainer
          support!
        </span>
        <button
          onClick={() => navigate("/plans")}
          className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-600"
        >
          Upgrade Now
        </button>
      </div>

      {/* Meals */}
      {meals?.map((meal, mealIndex) => {
        const totals = mealTotals(meal);
        return (
          <div
            key={meal.meal_type}
            className="border rounded-lg p-4 mb-6 shadow-sm relative"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">{meal.meal_type}</h2>
              <div className="text-sm bg-green-50 border border-green-200 rounded px-3 py-1">
                <strong>{totals.calories.toFixed(1)}</strong> kcal
              </div>
            </div>

            {/* Search box */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder={`Search food to add to ${meal.meal_type}`}
                value={activeMealIndex === mealIndex ? searchTerm : ""}
                onFocus={() => setActiveMealIndex(mealIndex)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveMealIndex(mealIndex);
                }}
                className="border rounded px-3 py-2 w-full"
              />
              {activeMealIndex === mealIndex && searchTerm && (
                <ul className="absolute bg-white border w-full max-h-40 overflow-y-auto mt-1 rounded shadow z-10">
                  {allFoods?.filter((f) =>
                    f.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                    .map((f) => (
                      <li
                        key={f._id}
                        onClick={() => handleAddFood(mealIndex, f)}
                        className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                      >
                        {f.name}
                      </li>
                    ))}
                  {allFoods.filter((f) =>
                    f.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                      <li className="px-3 py-1 text-gray-500">
                        No match —{" "}
                        <button
                          className="text-blue-600 underline"
                          onClick={() =>
                            setNewFood({ ...newFood, name: searchTerm })
                          }
                        >
                          Add “{searchTerm}”
                        </button>
                      </li>
                    )}
                </ul>
              )}
            </div>

            {/* Table of foods */}
            {meal.food_items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">Food</th>
                      <th className="border px-2 py-1">Qty</th>
                      <th className="border px-2 py-1">Unit</th>
                      <th className="border px-2 py-1">Calories</th>
                      <th className="border px-2 py-1">Protein (g)</th>
                      <th className="border px-2 py-1">Carbs (g)</th>
                      <th className="border px-2 py-1">Fat (g)</th>
                      <th className="border px-2 py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meal.food_items?.map((food, foodIndex) => {
                      const n = calcNutrition(food);
                      return (
                        <tr key={foodIndex}>
                          <td className="border px-2 py-1">{food.name}</td>
                          <td className="border px-2 py-1 w-20">
                            <input type="number" min="0" value={food.quantity} onChange={(e) => handleChange(mealIndex, foodIndex, "quantity", e.target.value)}
                              className="w-full border rounded px-1 py-0.5" />
                          </td>
                          <td className="border px-2 py-1">
                            <select value={food.unit} onChange={(e) => handleChange(mealIndex, foodIndex, "unit", e.target.value)}
                              className="border rounded px-1 py-0.5 w-full" >
                              {unitsList?.map((u) => (
                                <option key={u.name} value={u.name}>
                                  {u.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {n.calories}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {n.protein_g}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {n.carbs_g}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {n.fat_g}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <button onClick={() => handleRemoveFood(mealIndex, foodIndex)}
                              className="text-red-600 hover:text-red-800 font-semibold" >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No foods added yet for {meal.meal_type}.
              </p>
            )}
          </div>
        );
      })}

      {/* Add new food modal */}
      {newFood.name && (
        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Add New Food for Approval
          </h3>
          <input
            type="text"
            value={newFood.name}
            onChange={(e) =>
              setNewFood({ ...newFood, name: e.target.value })
            }
            className="border rounded px-2 py-1 mb-2 w-full"
            placeholder="Food Name"
          />
          <input
            type="text"
            value={newFood.ingredients.join(",")}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                ingredients: e.target.value.split(","),
              })
            }
            className="border rounded px-2 py-1 mb-2 w-full"
            placeholder="Ingredients (comma separated)"
          />
          <button
            onClick={handleAddNewFoodToDB}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Submit for Approval
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-md text-center">{error}</p>}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveTracking}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow" >
          Save Today's Tracking
        </button>
      </div>

    </div>
  );
};

export default MealTracker;
