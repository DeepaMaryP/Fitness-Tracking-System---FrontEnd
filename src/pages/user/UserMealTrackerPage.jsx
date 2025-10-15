import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { fetchAllFoodMaster } from "../../api/trainer/foodMaster";
import food from '../../assets/Food.jpg'

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMealIndex, setActiveMealIndex] = useState(null);
  const [newFood, setNewFood] = useState({ name: "", ingredients: [] });
  const auth = useSelector((state) => state.auth)

  useEffect(() => {
    fetchFoodMaster();
  }, []);

  const fetchFoodMaster = async () => {
    try {
      const data = await fetchAllFoodMaster(auth.token)
      setAllFoods(data);
    } catch (err) {
      console.error("Error fetching FoodMaster:", err)
    }
  };

  const handleAddFood = (mealIndex, food) => {
    const updated = [...meals];
    updated[mealIndex].food_items.push({
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
    });
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

  return (
    <div className="p-6 pl-2 pl=2 max-w-6xl mx-auto">
      <div className="flex justify-around py-4">
        <div className="flex self-end gap-2">
          <div className="rounded-full w-10 h-10 flex items-center justify-center">
            <img src={food} className='rounded-full h-full w-full' alt="" />
          </div>
          <h1 className="text-2xl text-center">Track Food</h1>
        </div>

        {/* Total for the day */}
        <div className="flex">
          <div className="bg-blue-50 border border-blue-300 rounded-lg shadow-sm ">
            <h2 className="text-lg font-semibold text-blue-700 mb-1">
              Total for Today
            </h2>
            <p className="text-gray-700">
              <strong>{totalDayNutrition.calories.toFixed(1)}</strong> kcal |
              Protein: {totalDayNutrition.protein_g.toFixed(1)} g |
              Carbs: {totalDayNutrition.carbs_g.toFixed(1)} g | Fat:{" "}
              {totalDayNutrition.fat_g.toFixed(1)} g
            </p>
          </div>
        </div>
      </div>



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
                  {allFoods?.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    f.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
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
            {meal.food_items.length > 0 && (
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
                            <input
                              type="number"
                              min="0"
                              value={food.quantity}
                              onChange={(e) =>
                                handleChange(
                                  mealIndex,
                                  foodIndex,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-1 py-0.5"
                            />
                          </td>
                          <td className="border px-2 py-1">
                            <select
                              value={food.unit}
                              onChange={(e) =>
                                handleChange(
                                  mealIndex,
                                  foodIndex,
                                  "unit",
                                  e.target.value
                                )
                              }
                              className="border rounded px-1 py-0.5 w-full"
                            >
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
                            <button
                              onClick={() =>
                                handleRemoveFood(mealIndex, foodIndex)
                              }
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {meal.food_items.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No foods added yet for {meal.meal_type}.
              </p>
            )}
          </div>
        );
      })}

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
    </div>
  );
};

export default MealTracker;
