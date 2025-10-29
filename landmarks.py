import os
import csv
from google import genai
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
else:
    print(f"API Key loaded successfully: {api_key[:4]}...")  # first 4 chars only


# --- Functions ---

def get_coordinates_from_csv(file_path):
    """Reads a CSV file with columns X (lat) and Y (lon) and returns a list of coordinates."""
    print(f"Reading CSV file: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"Error: CSV file not found at {file_path}")
        return []
    
    coordinates = []
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                lat = float(row["X"])
                lon = float(row["Y"])
                coordinates.append((lat, lon))
            except (KeyError, TypeError, ValueError):
                continue  # skip rows with invalid data
    
    print(f"Total points found: {len(coordinates)}")
    return coordinates

def sample_coordinates(coordinates, max_samples=20):
    """Samples a manageable number of coordinates evenly across the route."""
    if not coordinates:
        return []
        
    step = max(1, len(coordinates) // max_samples)
    sampled_coords = [coordinates[i] for i in range(0, len(coordinates), step)]
    
    # Ensure the start and end points are always included
    if coordinates[0] not in sampled_coords:
        sampled_coords.insert(0, coordinates[0])
    if coordinates[-1] not in sampled_coords and (not sampled_coords or sampled_coords[-1] != coordinates[-1]):
        sampled_coords.append(coordinates[-1])
        
    print(f"Sampling {len(sampled_coords)} points for analysis.")
    return sampled_coords

# --- Updated function to return indexed landmark info ---
def find_landmarks_with_gemini_indexed(sampled_coords):
    
    # 🟢 SOLUTION: Initialize the client locally again
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Error: Could not initialize Gemini Client. Details: {e}")
        return []

    coords_string = ", ".join([f"({lat:.4f}, {lon:.4f})" for lat, lon in sampled_coords])
    
    prompt = f"""
    Analyze the following GPS coordinates from a running route in order. 
    Identify the most prominent, famous, or noteworthy landmarks, parks, cities, or major areas.
    Output the landmarks in the same order as the coordinates, one per line.
    
    Coordinates:
    {coords_string}
    """
    
    print("\nSending coordinates to Gemini...")
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        landmarks_text = response.text.strip()
        # Split into lines and remove bullets if present
        landmarks = [line.lstrip("-• ").strip() for line in landmarks_text.splitlines() if line.strip()]
    except Exception as e:
        print(f"Error getting landmarks from Gemini: {e}")
        return []

    # Map each sampled coordinate to a landmark
    output = []
    for i, (coord, landmark) in enumerate(zip(sampled_coords, landmarks)):
        lat, lon = coord
        output.append((i, lon, lat, landmark))  # lon=X, lat=Y
    return output


# --- Main execution block ---
if __name__ == "__main__":
    file_name = "/mnt/c/Users/Chan/Desktop/404NotFound/storymap_coordinates.csv"
    
    # 🚨 Recommended Fix: Configure API key globally
    if api_key:
        try:
            genai.configure(api_key=api_key)
        except Exception as e:
            print(f"Error configuring Gemini: {e}")
            # The script will likely fail later if this doesn't work.

    if not file_name.lower().endswith('.csv'):
        print("Error: This script is configured for CSV files.")
    elif not os.path.exists(file_name):
        print(f"Error: CSV file not found at {file_name}")
    else:
        route_coords = get_coordinates_from_csv(file_name)
        
        if not route_coords:
            print("No coordinates found in CSV.")
        else:
            sampled_points = sample_coordinates(route_coords)
            
            if not sampled_points:
                print("No points available for analysis after sampling.")
            else:
                indexed_landmarks = find_landmarks_with_gemini_indexed(sampled_points)
                
                print("\n" + "="*40)
                print("✨ RUNNING ROUTE LANDMARKS (CSV with index, X, Y, landmark)")
                print("="*40)
                print("Index | X (Longitude) | Y (Latitude) | Landmark")
                for idx, x, y, landmark in indexed_landmarks:
                    print(f"{idx} | {x:.6f} | {y:.6f} | {landmark}")
                print("="*40)
