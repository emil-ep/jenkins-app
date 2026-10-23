# Todo App — Monorepo

A minimal todo application with a Node/Express backend and a React frontend, living in a single repository with independent Jenkins pipelines.

## Structure

```
jenkins-app/
├── backend/      # Express REST API  (port 3001)
├── frontend/     # React SPA         (port 3000, proxies /api → 3001)
├── package.json  # Yarn workspaces root
└── README.md
```

## Quick start

```bash
# Install all dependencies from repo root
yarn install

# Run backend
cd backend && yarn dev

# Run frontend (in a separate terminal)
cd frontend && yarn start
```

## Jenkins pipelines

Each sub-project ships its own `Jenkinsfile`.  
Create two **Pipeline** jobs in Jenkins and point each one at the same repository with its respective script path:

| Job name         | Script path              |
|------------------|--------------------------|
| `todo-backend`   | `backend/Jenkinsfile`    |
| `todo-frontend`  | `frontend/Jenkinsfile`   |

Both pipelines run: **Install → Lint → Test → Build**.
