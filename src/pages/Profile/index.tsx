// import { useState } from "react"
import { Trophy } from "lucide-react"
import { useGetProfile } from "@/api/profile"
import { useParams } from "react-router-dom"

export default function ProfilePage() {
const { id } = useParams<{ id: string }>(); // Access id from the URL params

  // If id is missing, show an error
  if (!id) {
    return <div>Error: User ID is missing!</div>;
  }


  // Use custom hook to get profile data
  const { data: responseData, isLoading, error } = useGetProfile(id);
  const userData = responseData;

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile!</div>;
  }

  console.log("id is ", id);
  console.log("userData is", userData);
  
  const getLevel = (score: number): string => {
    if (score < 200) return "[0x1][Newbie]"
    if (score < 500) return "[0x2][Scout]"
    if (score < 1000) return "[0x3][Codebreaker]"
    if (score < 1500) return "[0x4][Hacker]"
    if (score < 2000) return "[0x5][Cipher Hunter]"
    if (score < 3000) return "[0x6][Forger]"
    return "[0x7][Flag Conqueror]"
  }


  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto border ring-2 ring-blue-500 rounded-xl">
        {/* Profile Card */}
        <div className="w-full bg-white shadow-md rounded-lg p-8 flex flex-col items-center text-center">
          <div className="mb-6">
            <img
              src={userData?.image || "https://api.dicebear.com/9.x/identicon/svg"}
              alt={userData?.name || "Profile Picture"}
              className="w-32 h-32 rounded-full object-cover border border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">{userData?.name || "Undefined"}</h1>
            </div>

            <div className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-mono font-medium inline-block">
            {userData?.score !== undefined ? getLevel(userData.score) : "[0x1][Newbie]"}
            </div>

            <p className="text-gray-500 mt-1">{userData?.email || "Not available"}</p>

            <div className="mt-4 flex justify-center gap-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <h2 className="text-sm font-medium text-gray-500">Rank</h2>
                <p className="text-xl font-mono font-bold text-gray-800">{userData?.rank !==  undefined ? userData.rank : 0}</p>
              </div>
              <div className="text-center">
                <h2 className="text-sm font-medium text-gray-500">Completed</h2>
                <p className="text-xl font-mono font-bold text-gray-800">{userData?.result !==undefined ? userData.result: 0 }</p>
              </div>
              <div className="text-center">
                <h2 className="text-sm font-medium text-gray-500">Level</h2>
                <p className="text-xl font-mono font-bold text-gray-800">
                  <Trophy className="h-4 w-4 inline mr-1 text-yellow-500" />
                  {userData?.score !== undefined ? getLevel(userData.score) : 0 }

                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full flex gap-2">
            <button className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
              Edit Profile
            </button>
            <button className="flex-1 px-4 py-2 text-sm bg-gray-800 text-white hover:bg-gray-700 rounded-md transition-colors">
              View Challenges
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
