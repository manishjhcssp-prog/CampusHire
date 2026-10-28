/**
 * CampusHire Frontend API Client
 * Provides unified HTTP communication to the Node.js/Express SQLite backend.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getAuthToken() {
  return localStorage.getItem("campushire_token") || "";
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("campushire_token", token);
  } else {
    localStorage.removeItem("campushire_token");
  }
}

export function getStoredUser() {
  const user = localStorage.getItem("campushire_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem("campushire_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("campushire_user");
  }
}

/**
 * Universal Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        data.error ||
        data.message ||
        `HTTP ${response.status}: ${response.statusText}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, error);
    throw error;
  }
}

// ----------------------------------------------------
// Auth Service Endpoints
// ----------------------------------------------------
export const authApi = {
  async login(email, password) {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    const token = res.data?.token || res.token;
    const user = res.data?.user || res.user;
    if (token) {
      setAuthToken(token);
      setStoredUser(user);
    }
    return { ...res, token, user };
  },

  async register(registrationData) {
    const res = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(registrationData)
    });
    const token = res.data?.token || res.token;
    const user = res.data?.user || res.user;
    if (token) {
      setAuthToken(token);
      setStoredUser(user);
    }
    return { ...res, token, user };
  },

  async getMe() {
    return request("/auth/me");
  },

  logout() {
    setAuthToken("");
    setStoredUser(null);
  }
};

// ----------------------------------------------------
// Admin & Analytics Service Endpoints
// ----------------------------------------------------
export const adminApi = {
  async getDashboardStats() {
    return request("/admin/dashboard-stats");
  }
};

// ----------------------------------------------------
// Job Postings & Eligibility Engine Endpoints
// ----------------------------------------------------
export const jobsApi = {
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/jobs${query ? `?${query}` : ""}`;
    return request(endpoint);
  },

  async getJobById(id) {
    return request(`/jobs/${id}`);
  },

  async createJob(jobData) {
    return request("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData)
    });
  },

  async updateJob(id, jobData) {
    return request(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(jobData)
    });
  },

  async checkEligibility(jobId, studentId) {
    const endpoint = studentId
      ? `/jobs/${jobId}/check-eligibility/${studentId}`
      : `/jobs/${jobId}/check-eligibility`;
    return request(endpoint, {
      method: "POST"
    });
  }
};

// ----------------------------------------------------
// Applications Service Endpoints
// ----------------------------------------------------
export const applicationsApi = {
  async getApplications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/applications${query ? `?${query}` : ""}`;
    return request(endpoint);
  },

  async apply(jobId, studentId, force = false) {
    return request("/applications", {
      method: "POST",
      body: JSON.stringify({
        job_id: jobId,
        student_id: studentId,
        force
      })
    });
  },

  async updateStatus(applicationId, status, notes = "") {
    return request(`/applications/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes })
    });
  },

  async withdraw(applicationId) {
    return request(`/applications/${applicationId}/withdraw`, {
      method: "POST"
    });
  }
};

// ----------------------------------------------------
// Interview Schedules Endpoints
// ----------------------------------------------------
export const interviewsApi = {
  async getInterviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/interviews${query ? `?${query}` : ""}`;
    return request(endpoint);
  },

  async schedule(interviewData) {
    return request("/interviews", {
      method: "POST",
      body: JSON.stringify(interviewData)
    });
  },

  async update(id, updateData) {
    return request(`/interviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData)
    });
  }
};

// ----------------------------------------------------
// Students & Profiles Endpoints
// ----------------------------------------------------
export const studentsApi = {
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/students${query ? `?${query}` : ""}`;
    return request(endpoint);
  },

  async getProfile(id) {
    return request(`/students/${id}`);
  },

  async updateProfile(id, profileData) {
    return request(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(profileData)
    });
  }
};

export default {
  auth: authApi,
  admin: adminApi,
  jobs: jobsApi,
  applications: applicationsApi,
  interviews: interviewsApi,
  students: studentsApi,
  getAuthToken,
  setAuthToken,
  getStoredUser,
  setStoredUser
};
