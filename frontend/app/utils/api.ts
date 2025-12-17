const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const fetchData = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error ||
        errorData.message ||
        `Failed to fetch: ${response.status}`;
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error: any) {
    if (error.message) throw error;
    throw new Error(
      `Network error: ${error.message || "Failed to connect to server"}`
    );
  }
};

const postData = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error ||
        errorData.message ||
        `Failed to post: ${response.status}`;
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error: any) {
    if (error.message) throw error;
    throw new Error(
      `Network error: ${error.message || "Failed to connect to server"}`
    );
  }
};

const putData = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error ||
        errorData.message ||
        errorData.details ||
        `Failed to update: ${response.status}`;
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error: any) {
    if (error.message) throw error;
    throw new Error(
      `Network error: ${error.message || "Failed to connect to server"}`
    );
  }
};

const deleteData = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error ||
        errorData.message ||
        `Failed to delete: ${response.status}`;
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error: any) {
    if (error.message) throw error;
    throw new Error(
      `Network error: ${error.message || "Failed to connect to server"}`
    );
  }
};

export const getNotes = (sortBy: string, subject: string, search: string) => {
  const params = new URLSearchParams();
  if (sortBy) params.append("sortBy", sortBy);
  if (subject && subject !== "all") params.append("subject", subject);
  if (search) params.append("search", search);
  return fetchData(`/notes?${params.toString()}`);
};

export const getNote = (id: string) => fetchData(`/notes/${id}`);

export const createNote = (data: any) => postData("/notes", data);

export const updateNote = (id: string, data: any) =>
  putData(`/notes/${id}`, data);

export const deleteNote = (id: string) => deleteData(`/notes/${id}`);

export const getSubjects = () => fetchData("/subjects");

export const createSubject = (name: string) => postData("/subjects", { name });

export const deleteSubject = (id: string) => deleteData(`/subjects/${id}`);
