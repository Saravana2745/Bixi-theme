# BIXI Ride - GitHub Setup & Workflow Guide

Your project is located on your Desktop at:
`C:\Users\Sarav\OneDrive\Desktop\Bixi-theme`

As requested, the Git repository has been initialized with the **`development`** branch (avoiding the `main` branch so you can continuously upgrade and refine the codebase without premature deployments).

---

## 1. What Has Already Been Completed

1. Git initialized in `C:\Users\Sarav\OneDrive\Desktop\Bixi-theme`.
2. Switched to dedicated branch: **`development`**.
3. All 22 website files, 3D scripts, styles, semantic HTML pages, sitemap, and assets staged.
4. Clean initial commit created:
   ```text
   feat: initial commit for BIXI Ride bike rental in Madurai theme with Three.js 3D
   ```

---

## 2. Connecting to Your GitHub Repository

### Step 1: Create a New Repository on GitHub
1. Open your browser and go to [github.com/new](https://github.com/new).
2. Enter your repository name (e.g. `bixi-ride` or `bixi-bike-rental-madurai`).
3. Set the repository to **Public** or **Private**.
4. **Important**: Leave "Initialize this repository with a README" **UNCHECKED** (we already have our README and project files initialized locally).
5. Click **Create repository**.

---

### Step 2: Link Your Local Desktop Folder to GitHub

Open PowerShell or Command Prompt inside your desktop folder (`C:\Users\Sarav\OneDrive\Desktop\Bixi-theme`) and run:

```bash
# Add your GitHub remote repository (replace with your real GitHub repo URL)
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# Push your development branch directly to GitHub (NOT main)
git push -u origin development
```

*Example with GitHub CLI:*
```bash
gh repo create bixi-ride --public --source=. --remote=origin --push
```

---

## 3. How to Keep Upgrading the Site

Since you are working on the `development` branch, you can edit, test, and upgrade pages directly in your Desktop folder. Whenever you want to save a new milestone:

```bash
# 1. Check changed files
git status

# 2. Stage your changes
git add .

# 3. Commit your updates
git commit -m "feat: added new 3D bike model and updated rental pricing"

# 4. Push updates to GitHub on the development branch
git push origin development
```

---

## 4. Converting to PHP Later

When you are ready to convert this HTML/CSS/JS theme to PHP:
1. Rename `.html` files to `.php` (e.g. `index.html` → `index.php`).
2. Extract the common `<header>` into `includes/header.php`.
3. Extract the common `<footer>` into `includes/footer.php`.
4. Include them with:
   ```php
   <?php include 'includes/header.php'; ?>
   <!-- Page Content -->
   <?php include 'includes/footer.php'; ?>
   ```
5. You can create a new branch for the PHP conversion:
   ```bash
   git checkout -b php-conversion
   ```
