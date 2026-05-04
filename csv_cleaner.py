import pandas as pd
import tkinter as tk
from tkinter import filedialog
import json

def select_file():
    root = tk.Tk()
    root.withdraw()  # hide main window
    file_path = filedialog.askopenfilename(
        title="Select CSV File",
        filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
    )
    return file_path

def process_data(file_path):
    # Load CSV
    df = pd.read_csv(file_path)

    # Ensure correct column names (adjust if needed)
    df.columns = ["date", "value"]

    # Convert date column to datetime
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    # Drop invalid rows
    df = df.dropna(subset=["date", "value"])

    # Extract year
    df["year"] = df["date"].dt.year

    # Sort so earliest month comes first
    df = df.sort_values("date")

    # Keep first entry per year (earliest month)
    df_yearly = df.groupby("year", as_index=False).first()

    # Build dictionary
    result = {}
    for _, row in df_yearly.iterrows():
        year = str(int(row["year"]))
        value = row["value"]

        # Skip missing values
        if pd.notna(value):
            result[year] = float(value)

    return result

def main():
    file_path = select_file()
    if not file_path:
        print("No file selected.")
        return

    data = process_data(file_path)

    # Pretty JSON-style output
    output = json.dumps(data, indent=2)

    print(output)

    # Optional: save to file
    save_path = filedialog.asksaveasfilename(
        defaultextension=".json",
        filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
    )

    if save_path:
        with open(save_path, "w") as f:
            f.write(output)
        print(f"\nSaved to: {save_path}")

if __name__ == "__main__":
    main()