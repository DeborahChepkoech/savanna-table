
const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function getMenu() {
  const response = await fetch(`${API_BASE_URL}/menu`);

  if (!response.ok) {
    throw new Error("Failed to fetch the menu.");
  }

  return response.json();
}
