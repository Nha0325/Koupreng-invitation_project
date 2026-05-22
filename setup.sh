#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_ROOT="$SCRIPT_DIR"
cd "$PROJECT_ROOT"

SKIP_BACKEND=0
SKIP_FRONTEND=0
SKIP_DATABASE_SETUP=0
SKIP_TOOL_CHECK=0
RUN_BACKEND=0
RUN_FRONTEND_USER=0
RUN_FRONTEND_ADMIN=0

ISSUES=()
STARTED_PROCESSES=()

SUMMARY_SYSTEM="Not checked"
SUMMARY_TOOLS="Not checked"
SUMMARY_BACKEND_ENV="Not checked"
SUMMARY_FRONTEND_USER_ENV="Not checked"
SUMMARY_FRONTEND_ADMIN_ENV="Not checked"
SUMMARY_MYSQL="Skipped"
SUMMARY_FRONTEND_USER_DEPS="Skipped"
SUMMARY_FRONTEND_ADMIN_DEPS="Skipped"
SUMMARY_BACKEND="Skipped"

usage() {
    cat <<'EOF'
Usage: ./setup.sh [options]

Options:
  --skip-backend          Skip Java, backend, and MySQL checks.
  --skip-frontend         Skip Node/npm and frontend dependency install.
  --skip-database-setup   Skip MySQL database creation.
  --skip-tool-check       Skip tool validation.
  --run-backend           Start backend after setup.
  --run-frontend-user     Start frontend-user after setup.
  --run-frontend-admin    Start frontend-admin after setup.
  --help                  Show this help.
EOF
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --skip-backend) SKIP_BACKEND=1 ;;
        --skip-frontend) SKIP_FRONTEND=1 ;;
        --skip-database-setup) SKIP_DATABASE_SETUP=1 ;;
        --skip-tool-check) SKIP_TOOL_CHECK=1 ;;
        --run-backend) RUN_BACKEND=1 ;;
        --run-frontend-user) RUN_FRONTEND_USER=1 ;;
        --run-frontend-admin) RUN_FRONTEND_ADMIN=1 ;;
        --help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            usage
            exit 1
            ;;
    esac
    shift
done

section() {
    printf '\n%s\n' "$1"
}

info() {
    printf '  %s\n' "$1"
}

warn() {
    printf '  WARNING: %s\n' "$1"
}

add_issue() {
    local what="$1"
    local why="$2"
    local fix="$3"
    ISSUES+=("What failed: ${what}
Why: ${why}
Manual fix: ${fix}")
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

detect_os() {
    local kernel
    kernel="$(uname -s 2>/dev/null || echo unknown)"
    OS_KIND="$kernel"
    OS_FAMILY="unknown"
    OS_NAME="$kernel"

    if [ "$kernel" = "Darwin" ]; then
        OS_KIND="macOS"
        OS_FAMILY="macos"
        OS_NAME="$(sw_vers -productName 2>/dev/null || echo macOS) $(sw_vers -productVersion 2>/dev/null || true)"
        return
    fi

    if [ "$kernel" = "Linux" ]; then
        OS_KIND="Linux"
        OS_FAMILY="linux"
        OS_NAME="Linux"
        if [ -r /etc/os-release ]; then
            # shellcheck disable=SC1091
            . /etc/os-release
            OS_NAME="${PRETTY_NAME:-Linux}"
            case "${ID:-}" in
                ubuntu|debian) OS_FAMILY="debian" ;;
                fedora|rhel|centos|rocky|almalinux) OS_FAMILY="fedora" ;;
                arch|manjaro) OS_FAMILY="arch" ;;
                *)
                    case "${ID_LIKE:-}" in
                        *debian*) OS_FAMILY="debian" ;;
                        *fedora*|*rhel*) OS_FAMILY="fedora" ;;
                        *arch*) OS_FAMILY="arch" ;;
                    esac
                    ;;
            esac
        fi
    fi
}

install_hint() {
    case "$OS_FAMILY" in
        debian)
            cat <<'EOF'
Ubuntu/Debian:
sudo apt update
sudo apt install git nodejs npm mysql-client mysql-server
EOF
            ;;
        fedora)
            cat <<'EOF'
Fedora/RHEL:
sudo dnf install git nodejs npm mysql mysql-server
EOF
            ;;
        arch)
            cat <<'EOF'
Arch:
sudo pacman -S git nodejs npm mysql
EOF
            ;;
        macos)
            cat <<'EOF'
macOS:
brew install git node mysql
brew services start mysql
EOF
            ;;
        *)
            cat <<'EOF'
Install Git, Node.js 20+, npm, MySQL Server/client, and JDK 25 using your OS package manager.
EOF
            ;;
    esac
}

java25_hint() {
    if [ -d "$HOME/.sdkman" ]; then
        printf '%s\n' "Install JDK 25 manually from Eclipse Temurin/Adoptium, or use SDKMAN:"
        printf '%s\n' "sdk install java 25-tem"
    else
        printf '%s\n' "Install JDK 25 manually from Eclipse Temurin/Adoptium: https://adoptium.net/temurin/releases/?version=25"
        printf '%s\n' "If you use SDKMAN, run: sdk install java 25-tem"
    fi
    printf '%s\n' "Do not change global JAVA_HOME unless you intend to; set it in your shell profile after installing JDK 25."
}

version_major() {
    printf '%s' "$1" | sed -E 's/[^0-9]*([0-9]+).*/\1/'
}

java_major() {
    local output="$1"
    local version
    version="$(printf '%s' "$output" | sed -nE 's/.*version "([^"]+)".*/\1/p' | head -n 1)"
    if [ -z "$version" ]; then
        version="$output"
    fi
    printf '%s' "$version" | sed -E 's/^1\.([0-9]+).*/\1/; s/^([0-9]+).*/\1/'
}

create_env_if_missing() {
    local example="$1"
    local target="$2"
    local label="$3"

    if [ -f "$target" ]; then
        info "$label already exists"
        return 0
    fi

    if [ ! -f "$example" ]; then
        add_issue "$label" "Template file '$example' was not found." "Restore the missing .env.example file, then rerun ./setup.sh."
        return 1
    fi

    cp "$example" "$target"
    info "Created $label from $example"
}

get_env_value() {
    local file="$1"
    local key="$2"
    local matches
    if [ ! -f "$file" ]; then
        return 0
    fi
    matches="$(grep -E "^[[:space:]]*${key}[[:space:]]*=" "$file" || true)"
    if [ -z "$matches" ]; then
        return 0
    fi
    printf '%s\n' "$matches" | tail -n 1 | sed -E 's/^[^=]*=//'
}

set_env_value() {
    local file="$1"
    local key="$2"
    local value="$3"
    local tmp
    tmp="$(mktemp)"
    awk -v key="$key" -v value="$value" '
        BEGIN { done = 0 }
        $0 ~ "^[[:space:]]*" key "[[:space:]]*=" {
            print key "=" value
            done = 1
            next
        }
        { print }
        END {
            if (!done) {
                print key "=" value
            }
        }
    ' "$file" > "$tmp"
    mv "$tmp" "$file"
}

is_placeholder() {
    local value="${1:-}"
    [ -z "$value" ] || printf '%s' "$value" | grep -Eiq 'change_me|replace_with|your_|change_this'
}

parse_mysql_url() {
    local db_url="$1"
    DB_HOST="localhost"
    DB_PORT="3306"
    DB_NAME="koupreng_db"

    if [[ "$db_url" =~ ^jdbc:mysql://([^/:?]+)(:([0-9]+))?/([^?]+) ]]; then
        DB_HOST="${BASH_REMATCH[1]}"
        DB_PORT="${BASH_REMATCH[3]:-3306}"
        DB_NAME="${BASH_REMATCH[4]}"
        return 0
    fi

    return 1
}

mysql_service_hint() {
    cat <<'EOF'
Linux systemd:
sudo systemctl start mysql
or
sudo systemctl start mysqld

macOS Homebrew:
brew services start mysql
EOF
}

install_frontend_deps() {
    local dir="$1"
    local label="$2"

    if ! command_exists npm; then
        add_issue "$label dependencies" "npm was not found." "Install Node.js 20+ with npm, then rerun ./setup.sh."
        return 1
    fi

    if [ ! -f "$dir/package.json" ]; then
        info "Skipping $label because package.json was not found"
        return 0
    fi

    if [ -f "$dir/package-lock.json" ] && [ ! -d "$dir/node_modules" ]; then
        info "Running npm ci for $label"
        if ! (cd "$dir" && npm ci --no-audit --no-fund); then
            add_issue "$label dependencies" "npm ci failed." "Delete node_modules and package-lock.json only if your team agrees, then run npm install."
            return 1
        fi
    else
        info "Running npm install for $label"
        if ! (cd "$dir" && npm install --no-audit --no-fund); then
            add_issue "$label dependencies" "npm install failed." "Stop running dev servers and rerun ./setup.sh. Delete node_modules only if your team agrees."
            return 1
        fi
    fi
}

start_background() {
    local label="$1"
    local dir="$2"
    shift 2
    info "Starting $label in the background"
    (cd "$dir" && "$@") &
    STARTED_PROCESSES+=("$label PID $!")
}

section "[1/8] Checking system"
detect_os
SUMMARY_SYSTEM="$OS_NAME"
info "OS: $OS_NAME"
info "Project root: $PROJECT_ROOT"

section "[2/8] Checking required tools"
if [ "$SKIP_TOOL_CHECK" -eq 1 ]; then
    SUMMARY_TOOLS="Skipped by --skip-tool-check"
    info "Skipping tool checks because --skip-tool-check was provided"
else
    missing_tools=0

    for tool in bash chmod git; do
        if command_exists "$tool"; then
            info "$tool found: $(command -v "$tool")"
        else
            add_issue "$tool" "$tool was not found." "$(install_hint)"
            missing_tools=1
        fi
    done

    if [ "$SKIP_BACKEND" -eq 0 ]; then
        for tool in java javac; do
            if command_exists "$tool"; then
                info "$tool found: $(command -v "$tool")"
            else
                add_issue "$tool" "$tool was not found. Backend requires JDK 25." "$(java25_hint)"
                missing_tools=1
            fi
        done

        if command_exists java; then
            java_output="$(java -version 2>&1 || true)"
            java_line="$(printf '%s\n' "$java_output" | head -n 1)"
            java_major_version="$(java_major "$java_output")"
            info "Java: $java_line"
            if [ "$java_major_version" != "25" ]; then
                add_issue "Java 25" "Installed Java is not version 25. Backend pom.xml requires Java 25." "$(java25_hint)"
            fi
        fi

        if [ "$SKIP_DATABASE_SETUP" -eq 0 ]; then
            if command_exists mysql; then
                info "mysql found: $(command -v mysql)"
            else
                add_issue "mysql" "mysql client was not found." "$(install_hint)

If MySQL is installed but not running:
$(mysql_service_hint)"
                missing_tools=1
            fi
        fi
    fi

    if [ "$SKIP_FRONTEND" -eq 0 ]; then
        if command_exists node; then
            node_version="$(node --version 2>/dev/null || true)"
            node_major="$(version_major "$node_version")"
            info "Node.js: $node_version"
            if [ -z "$node_major" ] || [ "$node_major" -lt 20 ]; then
                add_issue "Node.js" "Installed Node.js version is '$node_version'. Use Node.js 20 LTS or newer." "$(install_hint)"
            fi
        else
            add_issue "node" "node was not found." "$(install_hint)"
            missing_tools=1
        fi

        if command_exists npm; then
            info "npm: $(npm --version 2>/dev/null || true)"
        else
            add_issue "npm" "npm was not found. Node may be installed without npm." "$(install_hint)"
            missing_tools=1
        fi
    fi

    if [ "$missing_tools" -eq 0 ]; then
        SUMMARY_TOOLS="Checked"
    else
        SUMMARY_TOOLS="Missing tools"
    fi
fi

section "[3/8] Preparing env files"
if create_env_if_missing "$PROJECT_ROOT/backend/.env.example" "$PROJECT_ROOT/backend/.env" "backend/.env"; then
    SUMMARY_BACKEND_ENV="Ready"
fi
if create_env_if_missing "$PROJECT_ROOT/frontend-user/.env.example" "$PROJECT_ROOT/frontend-user/.env.local" "frontend-user/.env.local"; then
    SUMMARY_FRONTEND_USER_ENV="Ready"
fi
if create_env_if_missing "$PROJECT_ROOT/frontend-admin/.env.example" "$PROJECT_ROOT/frontend-admin/.env.local" "frontend-admin/.env.local"; then
    SUMMARY_FRONTEND_ADMIN_ENV="Ready"
fi

if [ -f "$PROJECT_ROOT/frontend-user/.env.local" ] && [ -z "$(get_env_value "$PROJECT_ROOT/frontend-user/.env.local" "VITE_API_URL")" ]; then
    set_env_value "$PROJECT_ROOT/frontend-user/.env.local" "VITE_API_URL" "http://localhost:8080/api"
fi
if [ -f "$PROJECT_ROOT/frontend-admin/.env.local" ] && [ -z "$(get_env_value "$PROJECT_ROOT/frontend-admin/.env.local" "VITE_API_URL")" ]; then
    set_env_value "$PROJECT_ROOT/frontend-admin/.env.local" "VITE_API_URL" "http://localhost:8080/api"
fi
if [ -f "$PROJECT_ROOT/backend/.env" ]; then
    [ -n "$(get_env_value "$PROJECT_ROOT/backend/.env" "DB_URL")" ] || set_env_value "$PROJECT_ROOT/backend/.env" "DB_URL" "jdbc:mysql://localhost:3306/koupreng_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Phnom_Penh&allowPublicKeyRetrieval=true"
    [ -n "$(get_env_value "$PROJECT_ROOT/backend/.env" "DB_USERNAME")" ] || set_env_value "$PROJECT_ROOT/backend/.env" "DB_USERNAME" "root"
    [ -n "$(get_env_value "$PROJECT_ROOT/backend/.env" "DB_PASSWORD")" ] || set_env_value "$PROJECT_ROOT/backend/.env" "DB_PASSWORD" "change_me"
fi

section "[4/8] MySQL database setup"
if [ "$SKIP_BACKEND" -eq 1 ]; then
    SUMMARY_MYSQL="Skipped by --skip-backend"
    info "Skipping MySQL because --skip-backend was provided"
elif [ "$SKIP_DATABASE_SETUP" -eq 1 ]; then
    SUMMARY_MYSQL="Skipped by --skip-database-setup"
    info "Skipping MySQL database setup because --skip-database-setup was provided"
elif ! command_exists mysql; then
    SUMMARY_MYSQL="Missing mysql"
    add_issue "MySQL database setup" "mysql command was not found." "$(install_hint)

Start MySQL after installation:
$(mysql_service_hint)"
else
    backend_env="$PROJECT_ROOT/backend/.env"
    db_url="$(get_env_value "$backend_env" "DB_URL")"
    db_user="$(get_env_value "$backend_env" "DB_USERNAME")"
    db_password="$(get_env_value "$backend_env" "DB_PASSWORD")"

    if [ -z "$db_url" ]; then
        add_issue "MySQL database setup" "DB_URL is missing from backend/.env." "Edit backend/.env, then rerun ./setup.sh."
    elif ! parse_mysql_url "$db_url"; then
        add_issue "MySQL database setup" "Could not parse DB_URL '$db_url'." "Use a MySQL JDBC URL like jdbc:mysql://localhost:3306/koupreng_db?..."
    else
        db_user="${db_user:-root}"
        if is_placeholder "$db_password"; then
            read -rsp "MySQL password for ${db_user}: " db_password
            printf '\n'
            set_env_value "$backend_env" "DB_PASSWORD" "$db_password"
        fi

        if ! printf '%s' "$DB_NAME" | grep -Eq '^[A-Za-z0-9_]+$'; then
            add_issue "MySQL database setup" "Database name '$DB_NAME' is not safe for automatic setup." "Use letters, numbers, and underscores in DB_URL."
        elif ! MYSQL_PWD="$db_password" mysql -h "$DB_HOST" -P "$DB_PORT" -u "$db_user" -e "SELECT 1;" >/dev/null 2>&1; then
            SUMMARY_MYSQL="Connection failed"
            add_issue "MySQL database setup" "Could not connect to MySQL at $DB_HOST:$DB_PORT with user '$db_user'." "Check backend/.env credentials and start MySQL:
$(mysql_service_hint)"
        elif ! MYSQL_PWD="$db_password" mysql -h "$DB_HOST" -P "$DB_PORT" -u "$db_user" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" >/dev/null 2>&1; then
            SUMMARY_MYSQL="Database creation failed"
            add_issue "MySQL database setup" "Connected to MySQL, but could not create database '$DB_NAME'." "Grant database creation permission to '$db_user' or create the database manually."
        else
            SUMMARY_MYSQL="Database '$DB_NAME' ready"
            info "Database '$DB_NAME' is ready"
        fi
    fi
fi

section "[5/8] Install frontend dependencies"
if [ "$SKIP_FRONTEND" -eq 1 ]; then
    SUMMARY_FRONTEND_USER_DEPS="Skipped by --skip-frontend"
    SUMMARY_FRONTEND_ADMIN_DEPS="Skipped by --skip-frontend"
    info "Skipping frontend dependencies because --skip-frontend was provided"
else
    if install_frontend_deps "$PROJECT_ROOT/frontend-user" "frontend-user"; then
        SUMMARY_FRONTEND_USER_DEPS="Ready"
    else
        SUMMARY_FRONTEND_USER_DEPS="Failed"
    fi

    if install_frontend_deps "$PROJECT_ROOT/frontend-admin" "frontend-admin"; then
        SUMMARY_FRONTEND_ADMIN_DEPS="Ready"
    else
        SUMMARY_FRONTEND_ADMIN_DEPS="Failed"
    fi
fi

section "[6/8] Backend check"
if [ "$SKIP_BACKEND" -eq 1 ]; then
    SUMMARY_BACKEND="Skipped by --skip-backend"
    info "Skipping backend check because --skip-backend was provided"
elif [ ! -f "$PROJECT_ROOT/backend/mvnw" ]; then
    SUMMARY_BACKEND="Missing backend/mvnw"
    add_issue "Backend check" "backend/mvnw was not found." "Restore backend/mvnw, then rerun ./setup.sh."
else
    if [ ! -x "$PROJECT_ROOT/backend/mvnw" ]; then
        chmod +x "$PROJECT_ROOT/backend/mvnw"
        info "Made backend/mvnw executable"
    fi
    SUMMARY_BACKEND="Ready"
    info "backend/mvnw is ready"
fi

section "[7/8] Optional frontend run"
if [ "$RUN_FRONTEND_USER" -eq 0 ] && [ "$RUN_FRONTEND_ADMIN" -eq 0 ] && [ "$RUN_BACKEND" -eq 0 ]; then
    info "No run flags passed; dev servers were not started"
fi

section "[8/8] Summary"
printf '\nSetup completed.\n'
printf '\nSummary:\n'
printf -- '- System: %s\n' "$SUMMARY_SYSTEM"
printf -- '- Tools: %s\n' "$SUMMARY_TOOLS"
printf -- '- Backend env: %s\n' "$SUMMARY_BACKEND_ENV"
printf -- '- Frontend-user env: %s\n' "$SUMMARY_FRONTEND_USER_ENV"
printf -- '- Frontend-admin env: %s\n' "$SUMMARY_FRONTEND_ADMIN_ENV"
printf -- '- MySQL: %s\n' "$SUMMARY_MYSQL"
printf -- '- Frontend-user dependencies: %s\n' "$SUMMARY_FRONTEND_USER_DEPS"
printf -- '- Frontend-admin dependencies: %s\n' "$SUMMARY_FRONTEND_ADMIN_DEPS"
printf -- '- Backend: %s\n' "$SUMMARY_BACKEND"

if [ "${#ISSUES[@]}" -gt 0 ]; then
    printf '\nSome setup steps need manual action:\n'
    for issue in "${ISSUES[@]}"; do
        printf '\n%s\n' "$issue"
    done
    printf '\nAfter fixing the issue, rerun:\n'
    printf './setup.sh\n'
fi

cat <<'EOF'

Next steps:

Start backend:
cd backend
./mvnw spring-boot:run

Start frontend user:
cd frontend-user
npm run dev

Start frontend admin:
cd frontend-admin
npm run dev
EOF

if [ "${#ISSUES[@]}" -eq 0 ]; then
    if [ "$RUN_BACKEND" -eq 1 ]; then
        start_background "backend" "$PROJECT_ROOT/backend" ./mvnw spring-boot:run
    fi
    if [ "$RUN_FRONTEND_USER" -eq 1 ]; then
        start_background "frontend-user" "$PROJECT_ROOT/frontend-user" npm run dev
    fi
    if [ "$RUN_FRONTEND_ADMIN" -eq 1 ]; then
        start_background "frontend-admin" "$PROJECT_ROOT/frontend-admin" npm run dev
    fi

    if [ "${#STARTED_PROCESSES[@]}" -gt 0 ]; then
        printf '\nStarted processes:\n'
        for process in "${STARTED_PROCESSES[@]}"; do
            printf -- '- %s\n' "$process"
        done
    fi
else
    exit 1
fi
