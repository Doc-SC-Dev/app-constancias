<!-- db741565-6558-42d0-84b9-46510454d44a 05eb54ec-8e69-4875-96c1-3073d4b484f7 -->
# Catering Budget Management System Implementation

## Phase 1: RBAC & Authentication Enhancement

### 1.1 Database Schema - Roles & Permissions

Extend `src/db/schema.ts` to add:

- `role` table (id, name, description, createdAt, updatedAt)
- `permission` table (id, name, description, resource, action)
- `rolePermission` junction table
- `userRole` junction table (userId references user, roleId references role)
- Add `status` enum ('active', 'inactive', 'suspended') to existing `user` table

### 1.2 Better Auth RBAC Plugin

Modify `src/lib/auth.ts` to:

- Install and configure better-auth RBAC plugin
- Add session enrichment with roles and permissions (claims)
- Create helper functions `getSession()`, `requireAuth()`, `requireRole()`, `requirePermission()`

### 1.3 Centralized Validation Schemas

Create `src/lib/validations/auth.ts`:

- Move `loginSchema` from `src/lib/types/index.ts`
- Add `userSchema`, `roleSchema`, `permissionSchema`
- Export typed validators with ArkType

### 1.4 Seed Initial Roles

Create `src/db/seed.ts`:

- Seed Admin, Gestor, Lector roles
- Seed basic permissions (create_budget, edit_catalog, etc.)
- Link permissions to roles per RBAC matrix

### 1.5 Migration

Generate migration: `pnpm drizzle-kit generate` for RBAC tables

## Phase 2: Core Catalogs - Clients Module

### 2.1 Database Schema

Add to `src/db/schema.ts`:

- `client` table (id, businessName, taxId, contactName, email, phone, address, status, notes, createdAt, updatedAt, createdBy, updatedBy)
- Status enum: 'active', 'inactive'

### 2.2 Validations

Create `src/lib/validations/client.ts`:

- `clientSchema` with ArkType (businessName required, taxId format, email validation, phone optional)
- `clientFilterSchema` for search/list

### 2.3 Feature Module Structure

Create `src/features/clients/`:

- `actions.ts`: server actions (listClients, getClient, createClient, updateClient, deleteClient)
- `components/client-form.tsx`: reusable form with react-hook-form + ArkType resolver
- `components/client-list.tsx`: table with pagination, search, filters
- `components/client-card.tsx`: display component
- `types.ts`: TypeScript types derived from schemas

### 2.4 Routes

Create `src/app/(dashboard)/clients/`:

- `page.tsx`: list view with ClientList component
- `new/page.tsx`: create form
- `[id]/page.tsx`: view/edit client
- `layout.tsx`: protected layout with RBAC check

### 2.5 Migration

Generate migration for client table

## Phase 3: Ingredients & Unit Management

### 3.1 Database Schema

Add to `src/db/schema.ts`:

- `unit` table (id, name, abbreviation, type: 'weight'|'volume'|'quantity')
- `ingredient` table (id, name, unitId, baseQuantity, baseCost, supplier, status, createdAt, updatedAt, createdBy, updatedBy)
- Add computed field logic note: unitCost = baseCost / baseQuantity (calculated in app layer)

### 3.2 Validations

Create `src/lib/validations/ingredient.ts`:

- `ingredientSchema`: name required, unitId UUID, baseQuantity > 0, baseCost >= 0, supplier optional
- Validation for unit consistency

### 3.3 Feature Module

Create `src/features/ingredients/`:

- `actions.ts`: CRUD + `calculateUnitCost()` helper
- `components/ingredient-form.tsx`: form with unit selector
- `components/ingredient-list.tsx`: table with unit cost display
- `utils.ts`: `getUnitCost(ingredient)` function

### 3.4 Routes

Create `src/app/(dashboard)/ingredients/`:

- `page.tsx`: list with search by name/supplier
- `new/page.tsx`: create form
- `[id]/page.tsx`: view/edit

### 3.5 Units Seed & Migration

Update `src/db/seed.ts` with common units (gramos, kg, ml, litros, unidades)

Generate migration for ingredient + unit tables

## Phase 4: Recipes Module

### 4.1 Database Schema

Add to `src/db/schema.ts`:

- `recipe` table (id, name, servings, status, createdAt, updatedAt, createdBy, updatedBy)
- `recipeComponent` table (id, recipeId, ingredientId, quantity, notes)
- Add indexes on recipeId and ingredientId

### 4.2 Validations

Create `src/lib/validations/recipe.ts`:

- `recipeSchema`: name required, servings integer > 0
- `recipeComponentSchema`: ingredientId UUID, quantity > 0, notes optional
- `recipeWithComponentsSchema`: recipe + array of components (min 1 component)

### 4.3 Cost Calculation Logic

Create `src/features/recipes/calculations.ts`:

- `calculateRecipeCost(recipeId, requestedServings?)`: 
  - Fetch recipe with components and ingredients
  - For each component: quantity * ingredient.unitCost
  - If requestedServings provided: scale proportionally (requestedServings / recipe.servings)
  - Return totalCost and breakdown

### 4.4 Feature Module

Create `src/features/recipes/`:

- `actions.ts`: CRUD + `getRecipeWithCost()`
- `components/recipe-form.tsx`: form with dynamic component rows
- `components/recipe-cost-display.tsx`: real-time cost calculator (client-side)
- `components/ingredient-selector.tsx`: combobox for ingredient search
- `hooks/useRecipeCost.ts`: client hook for real-time calculation

### 4.5 Routes

Create `src/app/(dashboard)/recipes/`:

- `page.tsx`: list with cost preview
- `new/page.tsx`: builder with live cost
- `[id]/page.tsx`: view/edit with cost breakdown

### 4.6 Migration

Generate migration for recipe tables

## Phase 5: Products Module

### 5.1 Database Schema

Add to `src/db/schema.ts`:

- `productType` enum: 'food', 'beverage', 'implement'
- `product` table (id, type, name, recipeId nullable, directCost nullable, margin decimal, status, createdAt, updatedAt, createdBy, updatedBy)
- Constraint: if type='food' then recipeId required, else directCost required

### 5.2 Validations

Create `src/lib/validations/product.ts`:

- `productSchema`: type enum, name required, conditional validation (food requires recipeId, others require directCost), margin 0-5
- `productWithPriceSchema`: includes calculated suggestedPrice

### 5.3 Cost & Price Calculation

Create `src/features/products/calculations.ts`:

- `getProductCost(productId, servings?)`: 
  - If food: get recipe cost (with servings)
  - Else: return directCost
- `getSuggestedPrice(cost, margin)`: cost * (1 + margin)

### 5.4 Feature Module

Create `src/features/products/`:

- `actions.ts`: CRUD + `getProductWithPrice()`
- `components/product-form.tsx`: conditional fields by type
- `components/product-list.tsx`: filterable by type
- `components/product-card.tsx`: shows cost, margin, suggested price
- `hooks/useProductPrice.ts`: real-time price calculation

### 5.5 Routes

Create `src/app/(dashboard)/products/`:

- `page.tsx`: list with type filters
- `new/page.tsx`: create with type selector
- `[id]/page.tsx`: view/edit

### 5.6 Migration

Generate migration for product table

## Phase 6: Budgets Module (Core Feature)

### 6.1 Database Schema

Add to `src/db/schema.ts`:

- `budgetStatus` enum: 'draft', 'issued', 'accepted', 'rejected'
- `budget` table (id, clientId, budgetNumber nullable, status, issueDate, discount decimal 0-1, taxRate decimal 0-1, notes, subtotal, total, createdAt, updatedAt, createdBy, updatedBy)
- `budgetLine` table (id, budgetId, productId, quantity, servings nullable, unitCost, unitPrice, lineTotal, createdAt)

### 6.2 Snapshot Tables (for issued budgets)

Add to `src/db/schema.ts`:

- `budgetSnapshot` table (id, budgetId, snapshotDate, createdBy)
- `snapshotIngredient` table (id, snapshotId, ingredientId, name, unitCost, data jsonb)
- `snapshotRecipe` table (id, snapshotId, recipeId, name, cost, data jsonb)
- Purpose: freeze costs when budget is issued

### 6.3 Validations

Create `src/lib/validations/budget.ts`:

- `budgetSchema`: clientId UUID, discount 0-1, taxRate 0-1
- `budgetLineSchema`: productId, quantity > 0, servings integer > 0 (if applicable), unitPrice >= 0
- `budgetWithLinesSchema`: budget + array of lines (min 1 line)

### 6.4 Budget Calculations

Create `src/features/budgets/calculations.ts`:

- `calculateLineTotal(line)`: quantity * unitPrice
- `calculateBudgetTotals(lines, discount, taxRate)`:
  - subtotal = sum of line totals
  - discountAmount = subtotal * discount
  - taxableBase = subtotal - discountAmount
  - taxAmount = taxableBase * taxRate
  - total = taxableBase + taxAmount
  - Return object with all values

### 6.5 Snapshot Logic

Create `src/features/budgets/snapshot.ts`:

- `createBudgetSnapshot(budgetId)`: called when status changes to 'issued'
  - Get all products in budget with their recipes
  - Get all ingredients used
  - Store current costs in snapshot tables
  - Generate budgetNumber (e.g., "CANELA-2025-0001")

### 6.6 Feature Module

Create `src/features/budgets/`:

- `actions.ts`: CRUD + `issueBudget()`, `acceptBudget()`, `rejectBudget()`
- `components/budget-form.tsx`: header form (client, discount, tax)
- `components/budget-line-editor.tsx`: dynamic line rows with product selector
- `components/budget-totals.tsx`: displays subtotal, discount, tax, total
- `components/budget-viewer.tsx`: read-only view for issued budgets
- `hooks/useBudgetCalculations.ts`: client-side real-time totals
- `types.ts`: TypeScript types

### 6.7 Routes

Create `src/app/(dashboard)/budgets/`:

- `page.tsx`: list with status filters, client search
- `new/page.tsx`: budget editor (draft)
- `[id]/page.tsx`: view/edit (conditional based on status)
- `[id]/print/page.tsx`: print-friendly layout

### 6.8 Migration

Generate migration for budget and snapshot tables

## Phase 7: Audit & Logging

### 7.1 Database Schema

Add to `src/db/schema.ts`:

- `auditLog` table (id, userId, action, resource, resourceId, oldData jsonb, newData jsonb, ipAddress, userAgent, createdAt)
- Indexes on userId, resource, createdAt

### 7.2 Audit Middleware

Create `src/lib/audit.ts`:

- `logAudit(action, resource, resourceId, oldData?, newData?)`: helper function
- Automatically capture userId from session
- Called in server actions for critical operations

### 7.3 Integration

Update all feature action files to call `logAudit()` on create/update/delete/issue

### 7.4 UI for Admins

Create `src/app/(dashboard)/admin/audit/page.tsx`:

- List audit logs with filters (user, action, resource, date range)
- Read-only view

### 7.5 Migration

Generate migration for auditLog table

## Phase 8: Dashboard & Navigation

### 8.1 Protected Layout

Create `src/app/(dashboard)/layout.tsx`:

- Call `requireAuth()` from auth helpers
- Sidebar navigation with role-based menu items
- User menu with logout

### 8.2 Dashboard Components

Create `src/features/dashboard/`:

- `components/stats-card.tsx`: KPI display
- `components/budget-status-chart.tsx`: budgets by status
- `components/recent-budgets.tsx`: latest 5 budgets
- `actions.ts`: `getDashboardStats()`

### 8.3 Dashboard Route

Create `src/app/(dashboard)/page.tsx`:

- Display stats: total budgets, total clients, budgets by status
- Recent activity
- Quick actions (based on role)

### 8.4 Navigation Component

Create `src/components/nav/`:

- `sidebar.tsx`: collapsible sidebar with icons
- `user-menu.tsx`: avatar dropdown
- `breadcrumbs.tsx`: route-based breadcrumbs

## Phase 9: User Management (Admin Only)

### 9.1 Feature Module

Create `src/features/users/`:

- `actions.ts`: listUsers, updateUserRole, updateUserStatus, deleteUser (logical)
- `components/user-list.tsx`: table with role badges
- `components/role-selector.tsx`: combobox for role assignment
- `components/user-status-toggle.tsx`

### 9.2 Validations

Create `src/lib/validations/user.ts`:

- `updateUserSchema`: name, email, roleIds array, status

### 9.3 Routes

Create `src/app/(dashboard)/admin/users/`:

- `page.tsx`: user list with filters
- `[id]/page.tsx`: edit user (role assignment)

### 9.4 RBAC Check

Add middleware check: only Admin role can access `/admin/*` routes

## Phase 10: Shared UI Components & Utilities

### 10.1 Additional shadcn/ui Components

Install via CLI:

- table
- dialog
- dropdown-menu
- select
- combobox
- badge
- toast (already have sonner)
- tabs
- form
- checkbox
- radio-group
- sheet
- pagination
- avatar
- tooltip

### 10.2 Custom Components

Create `src/components/shared/`:

- `data-table.tsx`: reusable table with sorting, filtering, pagination
- `delete-dialog.tsx`: confirmation dialog
- `status-badge.tsx`: colored badge by status
- `empty-state.tsx`: no data placeholder
- `loading-skeleton.tsx`: skeleton loaders
- `currency-display.tsx`: format Chilean pesos
- `date-display.tsx`: format dates

### 10.3 Utility Functions

Create `src/lib/utils/`:

- `currency.ts`: `formatCurrency(amount)`, `parseCurrency(string)`
- `date.ts`: date formatting utilities
- `permissions.ts`: `hasPermission(user, permission)`, `hasRole(user, role)`

### 10.4 React Hooks

Create `src/hooks/`:

- `useDebounce.ts`: debounce search inputs
- `useMediaQuery.ts`: responsive helpers
- `useLocalStorage.ts`: persist UI state

## Phase 11: Middleware & Route Protection

### 11.1 Auth Middleware

Create `src/middleware.ts`:

- Check authentication on all `/dashboard/*` routes
- Redirect to `/login` if not authenticated
- Check role permissions for `/admin/*`
- Set security headers

### 11.2 Error Handling

Create `src/app/error.tsx`: global error boundary

Create `src/app/(dashboard)/error.tsx`: dashboard error boundary

### 11.3 Loading States

Create `src/app/(dashboard)/loading.tsx`: dashboard loading skeleton

## Phase 12: Final Polish & Testing Preparation

### 12.1 Metadata & SEO

Update `src/app/layout.tsx` metadata with proper title and description

### 12.2 Environment Variables

Update `.env.example` with all required variables

### 12.3 Database Indexes

Review and add performance indexes:

- Foreign keys
- Search fields (name columns)
- Status columns
- Date ranges

### 12.4 Type Safety Cleanup

Ensure all ArkType schemas export proper TypeScript types

Remove any `any` types

### 12.5 README Update

Document:

- Setup instructions
- Environment variables
- Database migrations
- Seeding data
- RBAC matrix

## Key Files & Structure

```
src/
├── features/              (Feature-based modules)
│   ├── clients/
│   ├── ingredients/
│   ├── recipes/
│   ├── products/
│   ├── budgets/
│   ├── dashboard/
│   └── users/
├── lib/
│   ├── validations/       (Centralized ArkType schemas)
│   ├── utils/
│   └── auth.ts
├── db/
│   ├── schema.ts          (All Drizzle tables)
│   └── seed.ts
├── components/
│   ├── shared/            (Reusable components)
│   ├── nav/
│   └── ui/                (shadcn/ui)
├── app/
│   ├── (dashboard)/       (Protected routes)
│   └── login/
└── middleware.ts
```

## Migration Strategy

Each phase generates its own migration:

1. RBAC tables
2. Client table
3. Ingredient + unit tables
4. Recipe tables
5. Product table
6. Budget + snapshot tables
7. Audit log table

Run `pnpm drizzle-kit generate` after schema changes, then `pnpm drizzle-kit migrate` to apply.

### To-dos

- [ ] Phase 1: RBAC & Authentication Enhancement - Schema, Better Auth config, validations, seed, migration
- [ ] Phase 2: Clients Module - Schema, validations, feature module, routes, migration
- [ ] Phase 3: Ingredients & Units - Schema, validations, feature module, routes, seed units, migration
- [ ] Phase 4: Recipes Module - Schema, validations, cost calculations, feature module with real-time cost, routes, migration
- [ ] Phase 5: Products Module - Schema, validations, cost/price calculations, feature module, routes, migration
- [ ] Phase 6: Budgets Module - Schema with snapshots, validations, calculations, snapshot logic, feature module, routes, migration
- [ ] Phase 7: Audit & Logging - Schema, middleware, integration with all features, admin UI, migration
- [ ] Phase 8: Dashboard & Navigation - Protected layout, dashboard components, navigation sidebar, breadcrumbs
- [ ] Phase 9: User Management - Admin-only feature module for user/role management, validations, routes with RBAC
- [ ] Phase 10: Shared UI Components - Install shadcn components, create custom shared components, utility functions, React hooks
- [ ] Phase 11: Middleware & Route Protection - Auth middleware, error boundaries, loading states
- [ ] Phase 12: Final Polish - Metadata, environment docs, database indexes, type safety, README