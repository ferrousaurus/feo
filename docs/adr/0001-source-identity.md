# Source identity is derived, not assigned

Sources have three variants (local path, remote URL, inline data) with no shared field, so identity is derived as a discriminated-prefix string (`path:…` / `url:…` / `data:<sha>`) rather than an explicit `id` field in the schema. This avoids a migration and user-facing IDs, at the cost of identity changing when the identifying field is edited. For inline data, keys are sorted before hashing so identity is robust against deep-merge reordering.
