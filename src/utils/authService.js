// Foydalanuvchilar va ularning individual ma'lumotlarini boshqaruvchi xizmat

const USERS_KEY = "bash_trainer_users_v2";
const CURRENT_SESSION_KEY = "bash_trainer_session_user_v2";

export const authService = {
  // Barcha ro'yxatdan o'tgan foydalanuvchilar
  getAllUsers() {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error(e);
      return {};
    }
  },

  // Hozir tizimga kirgan foydalanuvchi logini
  getCurrentUser() {
    try {
      return localStorage.getItem(CURRENT_SESSION_KEY) || null;
    } catch (e) {
      return null;
    }
  },

  // Ro'yxatdan o'tish (Register)
  register(name, login, password) {
    const cleanLogin = login.trim().toLowerCase();
    if (!cleanLogin || !password || !name) {
      return { success: false, message: "Barcha maydonlarni to'ldiring!" };
    }
    const users = this.getAllUsers();
    if (users[cleanLogin]) {
      return { success: false, message: "Bu login bilan foydalanuvchi allaqachon mavjud!" };
    }

    users[cleanLogin] = {
      name: name.trim(),
      login: cleanLogin,
      password: password, // client-side local storage
      createdAt: new Date().toISOString(),
      // Foydalanuvchining shaxsiy saqlangan trenajyor ma'lumotlari:
      data: {
        currentStageId: 1,
        completedStages: [],
        fs: null,
        history: []
      }
    };

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_SESSION_KEY, cleanLogin);
    return { success: true, user: users[cleanLogin] };
  },

  // Tizimga kirish (Login)
  login(login, password) {
    const cleanLogin = login.trim().toLowerCase();
    const users = this.getAllUsers();
    const user = users[cleanLogin];

    if (!user || user.password !== password) {
      return { success: false, message: "Login yoki parol noto'g'ri!" };
    }

    localStorage.setItem(CURRENT_SESSION_KEY, cleanLogin);
    return { success: true, user };
  },

  // Chiqish (Logout)
  logout() {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  },

  // Foydalanuvchining o'quv natijalarini saqlash
  saveUserData(login, { currentStageId, completedStages, fsData, history }) {
    if (!login) return;
    const users = this.getAllUsers();
    if (users[login]) {
      users[login].data = {
        currentStageId,
        completedStages,
        fs: fsData,
        history
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  // Foydalanuvchining ma'lumotlarini olish
  getUserData(login) {
    if (!login) return null;
    const users = this.getAllUsers();
    return users[login]?.data || null;
  },

  // Foydalanuvchining o'quv natijalarini tozalash (Restart)
  resetUserData(login) {
    if (!login) return;
    const users = this.getAllUsers();
    if (users[login]) {
      users[login].data = {
        currentStageId: 1,
        completedStages: [],
        fs: null,
        history: []
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }
};
