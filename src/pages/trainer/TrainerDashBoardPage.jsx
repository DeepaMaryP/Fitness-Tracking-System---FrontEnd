import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { fetchUsersAssignedToTrainer } from "../../api/admin/usertrainer";
import { calculateUserProgress } from "../../components/utils";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState([]);
  const auth = useSelector((state) => state.auth)

  const fetchUsers = async () => {
    try {
      const result = await fetchUsersAssignedToTrainer(auth.userId, auth.token)      
      if (result.success && result.data) {
        setUsers(result.data)
      }
    } catch (err) {
      console.error("Error fetching Users:", err)
    }
  }

  useEffect(() => {
    fetchUsers();


 /*    // Fetch recent messages
    setMessages([
      { _id: 1, user: "John Doe", message: "Can we review my workout?" },
      { _id: 2, user: "Mary Paul", message: "Done with today’s session!" },
      { _id: 3, user: "Alex", message: "I need to change my diet plan." },
    ]); */
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <h1 className="text-2xl font-semibold mb-4">Trainer Dashboard</h1>
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-3">
        <input type="text" placeholder="Search user..." className="border px-3 py-2 rounded-lg w-full md:w-1/3"
          onChange={(e) => setSearch(e.target.value.toLowerCase())} />
      </div>
      {/* Assigned Users */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Assigned Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users
              .filter((u) => u.name.toLowerCase().includes(search))
              .map((user) => (
                <div key={user.userId} onClick={() => navigate(`/trainer/user/${user.userId}`)}
                  className="border rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"  >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">{user.name}</h3>                   
                  </div>
                  <p className="text-sm text-gray-600">Goal: {user.goal_type}</p>
                  <p className="text-sm text-gray-600">Progress: {calculateUserProgress(user)}%</p>
                </div>
              ))}
          </div>

        </CardContent>
      </Card>

      {/* Recent Messages */}
      {/* <Card className="shadow-md"> */}
      {/* <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.slice(0, 2).map((msg) => (
            <div key={msg._id} className="border-b py-2">
              <p className="text-sm">
                <span className="font-semibold">{msg.user}</span>: {msg.message}
              </p>
            </div>
          ))} */}

      {/* "View All" link */}
      {/* {messages.length > 2 && (
            <button
              onClick={() => navigate("/trainer/messages")}
              className="text-blue-600 text-sm mt-2 hover:underline"
            >
              View All Messages →
            </button>
          )} */}
      {/* </CardContent> */}
      {/* </Card> */}
    </div>
  );
}
