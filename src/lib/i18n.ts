import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip: move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      // Navigation & UI
      "Welcome to Aurora": "Welcome to Aurora",
      "Premium Ecosystem": "Premium Ecosystem",
      Inventory: "Inventory",
      Community: "Community",
      Updates: "Updates",
      "Search...": "Search...",
      Profile: "Profile",
      Join: "Join",
      Logout: "Logout",

      // Auth Messages
      "Login successful": "Login successful",
      "Signup successful": "Signup successful",
      "Invalid credentials": "Invalid email or password",
      "Session expired": "Your session has expired. Please login again.",
      "Session restored": "Session restored",
      "Account type": "Account Type",
      Customer: "Customer",
      Seller: "Seller",
      Factory: "Factory",
      Admin: "Admin",
      "Store Name": "Store Name",
      "Factory Name": "Factory Name",
      "Verified Account": "Verified Account",
      "Unverified Account": "Unverified Account",
      Language: "Language",
      "User ID": "User ID",
      "Account Name": "Account Name",
    },
  },
  es: {
    translation: {
      // Navigation & UI
      "Welcome to Aurora": "Bienvenido a Aurora",
      "Premium Ecosystem": "Ecosistema Premium",
      Inventory: "Inventario",
      Community: "Comunidad",
      Updates: "Actualizaciones",
      "Search...": "Buscar...",
      Profile: "Perfil",
      Join: "Unirse",
      Logout: "Cerrar sesión",

      // Auth Messages
      "Login successful": "Inicio de sesión exitoso",
      "Signup successful": "Registro exitoso",
      "Invalid credentials": "Email o contraseña inválidos",
      "Session expired":
        "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
      "Session restored": "Sesión restaurada",
      "Account type": "Tipo de Cuenta",
      Customer: "Cliente",
      Seller: "Vendedor",
      Factory: "Fábrica",
      Admin: "Administrador",
      "Store Name": "Nombre de Tienda",
      "Factory Name": "Nombre de Fábrica",
      "Verified Account": "Cuenta Verificada",
      "Unverified Account": "Cuenta No Verificada",
      Language: "Idioma",
      "User ID": "ID de Usuario",
      "Account Name": "Nombre de Cuenta",
    },
  },
  fr: {
    translation: {
      // Navigation & UI
      "Welcome to Aurora": "Bienvenue dans Aurora",
      "Premium Ecosystem": "Écosystème Premium",
      Inventory: "Inventaire",
      Community: "Communauté",
      Updates: "Mises à jour",
      "Search...": "Chercher...",
      Profile: "Profil",
      Join: "Rejoindre",
      Logout: "Se déconnecter",

      // Auth Messages
      "Login successful": "Connexion réussie",
      "Signup successful": "Inscription réussie",
      "Invalid credentials": "Email ou mot de passe invalide",
      "Session expired": "Votre session a expiré. Veuillez vous reconnecter.",
      "Session restored": "Session restaurée",
      "Account type": "Type de Compte",
      Customer: "Client",
      Seller: "Vendeur",
      Factory: "Usine",
      Admin: "Administrateur",
      "Store Name": "Nom du Magasin",
      "Factory Name": "Nom de l'Usine",
      "Verified Account": "Compte Vérifié",
      "Unverified Account": "Compte Non Vérifié",
      Language: "Langue",
      "User ID": "ID d'Utilisateur",
      "Account Name": "Nom du Compte",
    },
  },
  ar: {
    translation: {
      // Navigation & UI
      "Welcome to Aurora": "مرحبا بك في Aurora",
      "Premium Ecosystem": "النظام البيئي المميز",
      Inventory: "المخزون",
      Community: "المجتمع",
      Updates: "التحديثات",
      "Search...": "ابحث...",
      Profile: "الملف الشخصي",
      Join: "انضم",
      Logout: "تسجيل الخروج",

      // Auth Messages
      "Login successful": "تم تسجيل الدخول بنجاح",
      "Signup successful": "تم التسجيل بنجاح",
      "Invalid credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      "Session expired": "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.",
      "Session restored": "تم استعادة الجلسة",
      "Account type": "نوع الحساب",
      Customer: "عميل",
      Seller: "بائع",
      Factory: "مصنع",
      Admin: "مسؤول",
      "Store Name": "اسم المتجر",
      "Factory Name": "اسم المصنع",
      "Verified Account": "حساب موثق",
      "Unverified Account": "حساب غير موثق",
      Language: "اللغة",
      "User ID": "معرف المستخدم",
      "Account Name": "اسم الحساب",
    },
  },
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: "en", // language to use, more info here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already does escaping
    },
  });

export default i18n;
