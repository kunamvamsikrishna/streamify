import axiosInstance from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

export const AuthUser = async () => {
  try{
    const res = await axiosInstance.get("/auth/me");
    console.log("Auth user response:", res.data);
    return res.data;
  }
  catch(err){
    console.log("Auth user error:", err);
    // Return null for 401 (unauthorized) - user is not logged in
    if (err.response?.status === 401) {
      return null;
    }
    // For other errors, throw to let React Query handle it
    throw err;
  }
};

export const completeonboarding = async (userdata) => {
  const response = await axiosInstance.post("/auth/onboarding", userdata);
  return response.data;
};


export const getRecommendedUsers = async ()=>{
   const response = await axiosInstance.get("/users")
   console.log(response.data)
   return response.data;
}

export const  getUserFriends= async ()=>{
  const response = await axiosInstance.get("/users/friends")
  return response.data;
}

export const  getOutgoingFriendReqs= async ()=>{
  const response = await axiosInstance.get("/users/outgoing-friend-requests")
  return response.data;
} 

export async function sendFriendRequest(userid) {
  const response = await axiosInstance.post(`/users/friend-request/${userid}`)
  return response.data;
}

export async function AcceptFrndRequest(userid) {
  const response = await axiosInstance.put(`/users/friend-request/${userid}/accept`)
  return response.data;
}

export async function GetRequests(){
  const response = await axiosInstance.get("/users/friend-requests")
  return response.data
}


export async function getStreamToken(){
  const response = await axiosInstance.get("/chats/token")
  return response.data
}