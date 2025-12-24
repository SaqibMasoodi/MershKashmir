import os
import json
import re

# --- CONFIGURATION ---
BASE_DIR = "products"
CATEGORIES = ["wearable", "dryfruit"]
OUTPUT_FILE = "data.js"
# ---------------------

def parse_folder_name(filename):
    """
    Parses folder names.
    - Removes sorting prefixes: Numbers (01_) AND 'z_' (for putting items at end).
    - Keeps words intact.
    """
    
    # 1. SPLIT BY PRICE SEPARATOR (__)
    if "__" in filename:
        parts = filename.split("__")
        raw_name = parts[0]
        try:
            price_part = os.path.splitext(parts[1])[0]
            price = int(price_part)
        except ValueError:
            price = 0
    else:
        raw_name = os.path.splitext(filename)[0]
        price = 0

    # 2. CLEAN THE NAME
    # Regex: Remove starting digits (01_) OR starting z's (z_, zz_)
    # flags=re.IGNORECASE makes it catch Z_ and z_
    clean_name = re.sub(r'^(\d+|z+)_', '', raw_name, flags=re.IGNORECASE)
    
    clean_name = clean_name.replace("_", " ").strip()

    return clean_name, price

def get_description(folder_path, product_name):
    desc_path = os.path.join(folder_path, "desc.txt")
    if os.path.exists(desc_path):
        try:
            with open(desc_path, "r", encoding="utf-8") as f:
                return f.read().strip()
        except Exception:
            pass
    return f"Authentic {product_name} sourced directly from Kashmir."

def scan_folders():
    catalog_data = { "wearable": [], "dryfruit": [] }
    print("📸 Scanning (hiding '01_' and 'z_' prefixes)...")

    for category in CATEGORIES:
        cat_path = os.path.join(BASE_DIR, category)
        if not os.path.exists(cat_path): continue

        for tag_folder in os.listdir(cat_path):
            tag_path = os.path.join(cat_path, tag_folder)
            if not os.path.isdir(tag_path): continue
            
            current_tag = tag_folder.lower()
            # Sort items so 01_ is first and z_ is last
            items = sorted(os.listdir(tag_path))
            
            for item in items:
                item_path = os.path.join(tag_path, item)
                is_folder = os.path.isdir(item_path)
                is_image = item.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
                
                if not (is_folder or is_image): continue

                product_name, price = parse_folder_name(item)
                images = []
                description = ""

                if is_folder:
                    description = get_description(item_path, product_name)
                    for img in sorted(os.listdir(item_path)):
                        if img.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                            images.append(f"{tag_path}/{item}/{img}".replace("\\", "/"))
                else:
                    images.append(f"{tag_path}/{item}".replace("\\", "/"))
                    description = f"Authentic {product_name}."

                if images:
                    product = {
                        "name": product_name,
                        "price": price,
                        "image": images[0],
                        "gallery": images,
                        "category": category,
                        "description": description,
                        "tags": [category, current_tag]
                    }
                    catalog_data[category].append(product)

    js_content = f"const generatedData = {json.dumps(catalog_data, indent=4)};"
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"\n✅ Done! Data updated.")

if __name__ == "__main__":
    scan_folders()