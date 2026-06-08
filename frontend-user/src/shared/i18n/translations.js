/**
 * UI translations for Khmer (km) and English (en).
 * Backend API responses are already localized via Accept-Language header.
 */
const translations = {
    km: {
        // ── Nav ────────────────────────────────────────────────────
        nav: {
            home: "ទំព័រដើម",
            templates: "គំរូសន្លឹកការ",
            pricing: "តម្លៃ",
            venues: "ទីកន្លែង",
            dashboard: "ផ្ទាំងគ្រប់គ្រង",
            login: "ចូលប្រើ",
            register: "ចាប់ផ្ដើមឥឡូវនេះ",
            logout: "ចាកចេញ",
        },

        // ── Auth ───────────────────────────────────────────────────
        auth: {
            loginTitle: "ចូលគណនី",
            loginSubtitle: "ចូលទៅកាន់គណនី Koupreng របស់អ្នក",
            registerTitle: "ចុះឈ្មោះ",
            registerSubtitle: "បង្កើតគណនី Koupreng របស់អ្នក",
            phoneOrEmail: "លេខទូរស័ព្ទ ឬ អ៊ីមែល",
            phoneOrEmailPlaceholder: "បញ្ចូលលេខទូរស័ព្ទ ឬ អ៊ីមែល",
            password: "លេខសម្ងាត់",
            passwordPlaceholder: "បញ្ចូលលេខសម្ងាត់",
            newPassword: "លេខសម្ងាត់ថ្មី",
            confirmPassword: "បញ្ជាក់លេខសម្ងាត់",
            fullName: "ឈ្មោះពេញ",
            fullNamePlaceholder: "បញ្ចូលឈ្មោះពេញ",
            signingIn: "កំពុងចូល...",
            signIn: "ចូលគណនី",
            registering: "កំពុងចុះឈ្មោះ...",
            registerBtn: "ចុះឈ្មោះ",
            orContinueWith: "ឬ បន្តជាមួយ",
            forgotPassword: "ភ្លេចលេខសម្ងាត់?",
            noAccount: "មិនទាន់មានគណនីមែនទេ?",
            haveAccount: "មានគណនីហើយ?",
            requiredFields: "សូមបញ្ចូលលេខទូរស័ព្ទ ឬ អ៊ីមែល និងលេខសម្ងាត់។",
            loginFailed: "ការចូលគណនីបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។",
        },

        // ── Home ───────────────────────────────────────────────────
        home: {
            heroSub: "មង្គលការឌីជីថល",
            heroTitle: "រៀបចំពិធីមង្គលការ",
            heroTitleHighlight: "ដ៏ល្អឥតខ្ចោះ",
            heroDesc:
                "គ្រប់គ្រងភ្ញៀវ ថវិកា និងផែនការការងាររបស់អ្នក ក្នុងវេទិកាតែមួយ ប្រកបដោយភាពងាយស្រួល និងស៊ីវិល័យ។",
            startCreating: "ចាប់ផ្តើមបង្កើត",
            viewPricing: "មើលតម្លៃកញ្ចប់",
            howItWorks: "តើវាដំណើរការយ៉ាងដូចម្ដេច?",
            choosePlan: "ជ្រើសរើសកញ្ចប់ដែលសាកសម",
        },

        // ── Common ────────────────────────────────────────────────
        common: {
            save: "រក្សាទុក",
            cancel: "បោះបង់",
            confirm: "បញ្ជាក់",
            delete: "លុប",
            edit: "កែ",
            loading: "កំពុងផ្ទុក...",
            error: "មានបញ្ហា",
            success: "ជោគជ័យ",
        },
    },

    en: {
        // ── Nav ────────────────────────────────────────────────────
        nav: {
            home: "Home",
            templates: "Templates",
            pricing: "Pricing",
            venues: "Venues",
            dashboard: "Dashboard",
            login: "Sign In",
            register: "Get Started",
            logout: "Sign Out",
        },

        // ── Auth ───────────────────────────────────────────────────
        auth: {
            loginTitle: "Sign In",
            loginSubtitle: "Welcome back to your Koupreng account",
            registerTitle: "Create Account",
            registerSubtitle: "Start planning your perfect wedding",
            phoneOrEmail: "Phone or Email",
            phoneOrEmailPlaceholder: "Enter your phone or email",
            password: "Password",
            passwordPlaceholder: "Enter your password",
            newPassword: "New Password",
            confirmPassword: "Confirm Password",
            fullName: "Full Name",
            fullNamePlaceholder: "Enter your full name",
            signingIn: "Signing in...",
            signIn: "Sign In",
            registering: "Creating account...",
            registerBtn: "Create Account",
            orContinueWith: "Or continue with",
            forgotPassword: "Forgot password?",
            noAccount: "Don't have an account?",
            haveAccount: "Already have an account?",
            requiredFields: "Please enter your phone/email and password.",
            loginFailed: "Sign in failed. Please try again.",
        },

        // ── Home ───────────────────────────────────────────────────
        home: {
            heroSub: "Digital Wedding Planning",
            heroTitle: "Plan Your Wedding",
            heroTitleHighlight: "Perfectly",
            heroDesc:
                "Manage guests, budget, and your planning checklist in one elegant platform built for Cambodian couples.",
            startCreating: "Start Creating",
            viewPricing: "View Pricing",
            howItWorks: "How Does It Work?",
            choosePlan: "Choose the Right Plan",
        },

        // ── Common ────────────────────────────────────────────────
        common: {
            save: "Save",
            cancel: "Cancel",
            confirm: "Confirm",
            delete: "Delete",
            edit: "Edit",
            loading: "Loading...",
            error: "Error",
            success: "Success",
        },
    },
};

export default translations;
