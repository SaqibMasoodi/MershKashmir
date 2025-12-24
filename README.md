# Mersh Kashmir – Website & Automation Guide

Welcome to the Mersh Kashmir e-commerce project. This is a static website featuring handcrafted wearables and premium dry fruits, managed entirely through folder organization and a Python automation script.

---

## 📂 Project Structure

- **`index.html`**: The main homepage. Double-click to view the site.
- **`builder.py`**: The "Engine". Run this script to update product data after changing folders.
- **`data.js`**: (Auto-generated) Stores the product catalog. Do not edit manually.
- **`assets/`**: Static images (Logo, `dummy.png` placeholder).
- **`products/`**: Your database. This is where you add/remove items.

---

## 🚀 How to Add Products

You manage your inventory by creating folders. No coding required.

### 1. Choose the Right Section
Navigate to `mersh/products/` -> `Category` -> `Section`.
* *Example:* `mersh/products/wearable/heritage` (for Heritage Shawls).

### 2. Create the Product Folder
Name the folder using this specific format:

`[SortOrder]_[ProductName]__[Price]`

* **`SortOrder` (Optional):** Use `01_`, `02_` to force items to the top.
* **`ProductName`:** The name displayed on the card.
* **`__Price`:** Double underscore followed by the price (no commas).

**Examples:**
* `01_Royal Pashmina__15000` (Appears **1st** as "Royal Pashmina", Price: ₹15,000)
* `02_Kani Shawl__25000` (Appears **2nd** as "Kani Shawl", Price: ₹25,000)
* `Blue Scarf__1200` (Sorted alphabetically after the numbered items).

### 3. Add Images
* **Cover Image:** The first image alphabetically (e.g., `01_front.jpg`) becomes the card cover.
* **Gallery:** All images inside the folder will appear in the popup modal.

### 4. Add Description (Optional)
To replace the auto-generated text, create a file named **`desc.txt`** inside the product folder.
* Open `desc.txt`, type your description, and save.
* *Note:* This only works for Folder-based products, not single image files.

---

## ⚡ Update the Website

After adding, renaming, or deleting folders, you **must** update the data file:

1.  Open **Command Prompt** (cmd) inside the `mersh` folder.
2.  Run the command:
    ```bash
    python builder.py
    ```
3.  Refresh `index.html` in your browser.

---

## 🛠 Special Features & Edge Cases

### 1. "Coming Soon" / Placeholders
If you have an empty spot or want to tease a product:
1.  Create a folder named `Coming Soon__0` (Price must be 0).
2.  Paste the **`dummy.png`** from the `assets` folder into it.
3.  The website will automatically display "Coming Soon" and disable the "Add to Cart" button.

### 2. Empty Folders
If a product folder contains **zero images**, the automation script will ignore it. It will NOT appear on the website.

### 3. Single Files vs. Folders
* **Best Practice:** Create a **Folder** for every product (supports multiple images + `desc.txt`).
* **Quick Way:** You *can* just drop a file named `Almonds__900.jpg` directly into a section, but you cannot add extra gallery photos or custom text to it.

---

## 🌍 Deployment

* **Share:** Zip the entire `mersh` folder and send it.
* **Go Live:** Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop).
    * *Remember:* Run `python builder.py` on your computer **before** uploading. Netlify cannot run the Python script.

---
*Project maintained by Ash & Sam Solutions Kashmir.*