const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const fetchData = async (endpoint: string) => {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

const postData = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to post data");
  }
  return response.json();
};

const putData = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.details || errorData.error || "Failed to update data";
    throw new Error(errorMessage);
  }
  return response.json();
};

const deleteData = async (endpoint: string) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete data");
  }
  return response.json();
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
