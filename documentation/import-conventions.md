# Import Conventions

This document outlines the import conventions used in the Prashasak Samiti E-commerce Platform codebase.

## Using the `@/` Alias Pattern

All imports in the codebase should use the `@/` alias pattern to reference files from the root of the `src` directory. This makes imports cleaner and more maintainable, especially when moving files between directories.

### Examples

#### Correct:

```javascript
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/products/ProductCard';
import { productAPI } from '@/services/api';
import dbConnect from '@/utils/db';
```

#### Incorrect:

```javascript
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import { productAPI } from '../../../services/api';
import dbConnect from './db';
```

## Special Cases

### CSS Imports in Layout Files

For CSS imports in layout files within the app directory, it's acceptable to use relative imports:

```javascript
// This is acceptable for CSS imports in layout files
import "../globals.css";
```

## Benefits of Using the `@/` Alias Pattern

1. **Cleaner Code**:
   - Imports are shorter and easier to read
   - No need to count the number of `../` to navigate up the directory tree

2. **Maintainability**:
   - If you move a file to a different directory, you don't need to update all the relative imports
   - All imports are relative to the root of the project, making it easier to understand where files are located

3. **Consistency**:
   - All imports follow the same pattern, making the codebase more consistent
   - This is especially important in larger projects with many developers

## Configuration

The `@/` alias is configured in the `jsconfig.json` file at the root of the project:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

This configuration allows both the IDE and Next.js to understand the `@/` alias pattern.
