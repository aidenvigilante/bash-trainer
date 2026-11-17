// Foydalanuvchilar, ularning distrolari va natijalarini boshqaruvchi yangilangan xizmat

const USERS_KEY = "bash_trainer_users_v3";
const CURRENT_SESSION_KEY = "bash_trainer_session_user_v3";

export const authService = {
  getAllUsers() {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error(e);
      return {};
    }
  },

  getCurrentUser() {
    try {
      return localStorage.getItem(CURRENT_SESSION_KEY) || null;
    } catch (e) {
      return null;
    }
  },

  register(name, login, password, initialDistro = "ubuntu") {
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
      password: password,
      activeDistro: initialDistro,
      unlockedDistros: [initialDistro], // Faqat boshlang'ich distro ochiq
      theme: "darkBlack",
      createdAt: new Date().toISOString(),
      // Har bir distro uchun alohida progress
      distroData: {
        [initialDistro]: {
          currentStageId: 1,
          completedStages: [],
          fs: null,
          history: []
        }
      }
    };

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_SESSION_KEY, cleanLogin);
    return { success: true, user: users[cleanLogin] };
  },

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

  logout() {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  },

  // Distro ma'lumotlarini saqlash
  saveDistroProgress(login, distroId, { currentStageId, completedStages, fsData, history }) {
    if (!login || !distroId) return;
    const users = this.getAllUsers();
    if (users[login]) {
      if (!users[login].distroData) users[login].distroData = {};
      users[login].distroData[distroId] = {
        currentStageId,
        completedStages,
        fs: fsData,
        history
      };

      // Agar ushbu distroning barcha 45 ta vazifasi tugasa, barcha distrolarni ochish yoki navbatdagisini ochish
      if (completedStages.length >= 45) {
        const allDistroIds = ["ubuntu", "tuxedo", "arch", "fedora", "kali"];
        const unlocked = users[login].unlockedDistros || [distroId];
        allDistroIds.forEach(id => {
          if (!unlocked.includes(id)) unlocked.push(id);
        });
        users[login].unlockedDistros = unlocked;
      }

      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  // Distro ma'lumotlarini olish
  getDistroProgress(login, distroId) {
    if (!login || !distroId) return null;
    const users = this.getAllUsers();
    return users[login]?.distroData?.[distroId] || null;
  },

  // Faol distroni o'zgartirish
  setActiveDistro(login, distroId) {
    if (!login) return;
    const users = this.getAllUsers();
    if (users[login]) {
      users[login].activeDistro = distroId;
      if (!users[login].distroData) users[login].distroData = {};
      if (!users[login].distroData[distroId]) {
        users[login].distroData[distroId] = {
          currentStageId: 1,
          completedStages: [],
          fs: null,
          history: []
        };
      }
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  // Mavzuni saqlash
  saveTheme(login, themeId) {
    if (!login) return;
    const users = this.getAllUsers();
    if (users[login]) {
      users[login].theme = themeId;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  resetDistroProgress(login, distroId) {
    if (!login || !distroId) return;
    const users = this.getAllUsers();
    if (users[login] && users[login].distroData?.[distroId]) {
      users[login].distroData[distroId] = {
        currentStageId: 1,
        completedStages: [],
        fs: null,
        history: []
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }
};
