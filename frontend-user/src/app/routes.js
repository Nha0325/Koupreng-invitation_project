/**
 * កំណត់ចំណាំ: path constants + HIDDEN_LAYOUT_PATHS
 * ឯកសារ: src/app/routes.js
 * ចាស់: HIDDEN_LAYOUT_PATHS ក្នុង App.jsx
 */
/** Path សាធារណៈ — ប្រើពេល link/navigate */
export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  venues: "/venues",
  templates: "/templates",
  templateDetail: (id) => `/templates/${id}`,
  templatePreview: (id) => `/templates/${id}/preview`,
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  events: "/events",
  createEvent: "/events/create",
  dashboard: "/dashboard",
  guests: "/guests",
  expenses: "/expenses",
  gifts: "/gifts",
  addTemplate: "/add-template",
  admin: "/admin",
  adminDashboard: "/admin/dashboard",
  adminUsers: "/admin/users",
  adminTemplates: "/admin/templates",
  adminSubscriptions: "/admin/subscriptions",
  adminVenues: "/admin/venues",
  adminTransactions: "/admin/transactions",
  adminLogs: "/admin/logs",
};

/* ── បញ្ជី Path ដែលត្រូវលាក់ Header & Footer (រួមទាំងទំព័រ Dashboard និង Admin) ── */
export const HIDDEN_MARKETING_LAYOUT_PREFIXES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  ROUTES.events,
  ROUTES.dashboard,
  ROUTES.guests,
  ROUTES.expenses,
  ROUTES.gifts,
  ROUTES.addTemplate,
  ROUTES.admin, // លាក់ Header/Footer របស់ Website ធម្មតាចោល ពេលចូលទំព័រ Admin
];
