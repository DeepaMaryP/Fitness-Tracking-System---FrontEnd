import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Buttons";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { useNavigate } from "react-router-dom";
import { createBodyMeasurement, fetchBodyMeasurementWithUserId, updateBodyMeasurement } from "../../api/user/bodymeasurement";
import { useSelector } from "react-redux";

const BodyMeasurementsPage = () => {
    const navigate = useNavigate()
    const auth = useSelector((state) => state.auth)
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        weight_kg: "",
        Hip_cm: "",
        Waist_cm: "",
        Chest_cm: "",
        Thigh_cm: "",
        Arm_cm: "",
        Calf_cm: "",
    });
    const [measureId, setMeasureId] = useState(null);
    const [records, setRecords] = useState([]);
    const [error, setError] = useState("");

    // Fetch all records (sorted latest first)
    const fetchMeasurements = async (afterSave = false) => {
        try {
            const result = await fetchBodyMeasurementWithUserId(auth.userId, auth.token)
            if (result.success && result.data) {
                const sorted = result.data
                const today = new Date().toISOString();                

                if (sorted.length > 0) {
                    if (afterSave) {
                        setRecords(sorted)
                        setFormData({
                            date: today.split("T")[0],
                            weight_kg: "",
                            Hip_cm: "",
                            Waist_cm: "",
                            Chest_cm: "",
                            Thigh_cm: "",
                            Arm_cm: "",
                            Calf_cm: "",
                        });

                    } else {
                        const latest = sorted[0];
                        setFormData({
                            date: today.split("T")[0],
                            weight_kg: latest.weight_kg,
                            Hip_cm: latest.Hip_cm || "",
                            Waist_cm: latest.Waist_cm || "",
                            Chest_cm: latest.Chest_cm || "",
                            Thigh_cm: latest.Thigh_cm || "",
                            Arm_cm: latest.Arm_cm || "",
                            Calf_cm: latest.Calf_cm || "",
                        });
                        const history = sorted.slice(1);
                        setRecords(history);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newFormData = { ...formData, userId: auth.userId }
            const data = measureId ? await updateBodyMeasurement(measureId, newFormData, auth.token) :
                await createBodyMeasurement(newFormData, auth.token)
            if (data.success) {
                setMeasureId(null);
                fetchMeasurements(true);
            } else {
                setError(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (item) => {
        setMeasureId(item._id);
        setFormData({
            date: item.date.split("T")[0],
            weight_kg: item.weight_kg,
            Hip_cm: item.Hip_cm || "",
            Waist_cm: item.Waist_cm || "",
            Chest_cm: item.Chest_cm || "",
            Thigh_cm: item.Thigh_cm || "",
            Arm_cm: item.Arm_cm || "",
            Calf_cm: item.Calf_cm || "",
        });
        setError("");
    };

    const viewProgress = () => {
        navigate("/user/bodylogs")
    }

    return (
        <div className="p-4 max-w-5xl mx-auto mt-8">
            {/* Form */}
            <Card className="shadow-md border rounded-2xl mb-6">
                <CardHeader>
                    <CardTitle className="text-xl text-center">
                        {measureId ? "Edit Body Measurements" : "Add Body Measurements"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {measureId &&
                                <div>
                                    <Label>Date</Label>
                                    <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
                                </div>}
                            <div>
                                <Label>Weight (kg)</Label>
                                <Input type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} step="0.1" required />
                            </div>
                            {["Hip", "Waist", "Chest", "Thigh", "Arm", "Calf"].map((part) => (
                                <div key={part}>
                                    <Label>{part} (cm)</Label>
                                    <Input type="number" name={`${part}_cm`} value={formData[`${part}_cm`]} onChange={handleChange} step="0.1" />
                                </div>
                            ))}
                        </div>

                        {error && <p className="text-red-500 text-md text-center">{error}</p>}

                        <div className="flex justify-center pt-4">
                            <Button type="submit" className="w-40">
                                {measureId ? "Update" : "Save"}
                            </Button>
                            {measureId && <Button className="ml-5 w-40" onClick={() => { setMeasureId(null) }}> Cancel </Button>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Recent Records */}
            <Card className="shadow-md border rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg flex justify-between items-center">
                        Recent Measurements
                        <Button
                            variant="outline"
                            onClick={viewProgress}
                        >
                            View Progress
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Weight (kg)</th>
                                    <th className="p-2">Waist</th>
                                    <th className="p-2">Hip</th>
                                    <th className="p-2">Chest</th>
                                    <th className="p-2 text-center">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.slice(0, 8).map((r) => (
                                    <tr key={r._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">
                                            {new Date(r.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-2">{r.weight_kg}</td>
                                        <td className="p-2">{r.Waist_cm || "-"}</td>
                                        <td className="p-2">{r.Hip_cm || "-"}</td>
                                        <td className="p-2">{r.Chest_cm || "-"}</td>
                                        <td className="p-2 text-center">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(r)}
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {records.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-3 text-center text-gray-500">
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BodyMeasurementsPage;
