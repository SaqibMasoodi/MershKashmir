# Mersh Kashmir

Static e-commerce platform managed via filesystem structure.

## Overview

- **index.html**: Application entry point.
- **builder.py**: Data aggregation utility.
- **data.js**: Generated product registry.
- **products/**: Content source directory.

## Content Management

Products are organized by directory hierarchy within `products/`.

### Naming Convention

Directories must follow the schema: `[SortOrder]_[ProductName]__[Price]`

- **SortOrder**: Optional prefix for ordering (e.g., `01_`).
- **ProductName**: Display title.
- **Price**: Numeric value preceded by double underscore.

**Example:** `01_Royal Pashmina__15000`

### Product Assets

- **Images**: All image files in the directory are included. The alphabetically first image serves as the cover.
- **Description**: Defined in `desc.txt`.

### Placeholders

Directories named `Coming Soon__0` with a `dummy.png` file render as upcoming items.

## Build System

To update the catalog, execute:

```bash
python builder.py
```

This updates `data.js`.

## Deployment

We deploy the directory as a static site after ensuring the build script is run.

---
Maintained by Ash & Sam Solutions Kashmir.
