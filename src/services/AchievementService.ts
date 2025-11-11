
import api from "./Api";
import type  { Achievement, ApiResponse } from "../types/Index";

interface AchievementsResponse{
achievements: Achievement[];
count: number;
total: number;
progress:number;
}

export const AchievmentService ={
    getUserAchievements: async ():Promise<Achievement[]>=>{
        const response = await api.get<ApiResponse<AchievementsResponse>>('/achievements');
        return response.data.data?.achievements!
    
    },
    getProgress: async ()=>{
        const response = await api.get('/achievements/progress');
        return response.data.data;
    },
     getAvailableAchievements: async () => {
    const response = await api.get('/achievements/available');
    return response.data.data;
  },

  getLeaderboard: async (limit = 50) => {
    const response = await api.get(`/achievements/leaderboard?limit=${limit}`);
    return response.data.data;
  },
}