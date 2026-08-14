import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export const getPassengerProfile = async () => {
  const token = localStorage.getItem('token');
  
  let storedUser = {};
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) storedUser = JSON.parse(rawUser);
  } catch (e) {
    storedUser = {};
  }

  const fallbackEmail = localStorage.getItem('email') || storedUser.email || '';

  try {
    let response;
    try {
      response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      if (fallbackEmail) {
        response = await axios.get(`${API_BASE_URL}/users/email/${fallbackEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        throw err;
      }
    }

    const data = response.data || {};
    const finalProfile = {
      name: data.name || localStorage.getItem('name') || storedUser.name || '',
      email: data.email || fallbackEmail || '',
      phone: data.phone || data.phoneNumber || localStorage.getItem('phone') || storedUser.phone || '',
      gender: data.gender || localStorage.getItem('gender') || storedUser.gender || 'Male',
      role: data.role || localStorage.getItem('role') || 'PASSENGER'
    };

    if (finalProfile.name) localStorage.setItem('name', finalProfile.name);
    if (finalProfile.email) localStorage.setItem('email', finalProfile.email);
    if (finalProfile.phone) localStorage.setItem('phone', finalProfile.phone);
    if (finalProfile.gender) localStorage.setItem('gender', finalProfile.gender);
    if (finalProfile.role) localStorage.setItem('role', finalProfile.role);

    return { data: finalProfile };
  } catch (error) {
    return {
      data: {
        name: localStorage.getItem('name') || storedUser.name || '',
        email: fallbackEmail,
        phone: localStorage.getItem('phone') || storedUser.phone || '',
        gender: localStorage.getItem('gender') || storedUser.gender || 'Male',
        role: localStorage.getItem('role') || storedUser.role || 'PASSENGER'
      }
    };
  }
};

export const updatePassengerProfile = async (profileData) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedUser = response.data || {};

    // Synchronize local session with updated database values
    if (updatedUser.name) localStorage.setItem('name', updatedUser.name);
    if (updatedUser.email) localStorage.setItem('email', updatedUser.email);
    if (updatedUser.phone) localStorage.setItem('phone', updatedUser.phone);
    if (updatedUser.gender) localStorage.setItem('gender', updatedUser.gender);

    try {
      const rawUser = localStorage.getItem('user');
      const userObj = rawUser ? JSON.parse(rawUser) : {};
      if (updatedUser.name) userObj.name = updatedUser.name;
      if (updatedUser.email) userObj.email = updatedUser.email;
      if (updatedUser.phone) userObj.phone = updatedUser.phone;
      if (updatedUser.gender) userObj.gender = updatedUser.gender;
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (e) {}

    return response;
  } catch (error) {
    console.error("Failed to update profile on backend:", error);
    throw error;
  }
};