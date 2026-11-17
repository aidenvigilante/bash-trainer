// 15 bosqichli Linux Bash topshiriqlari
export const stages = [
  {
    id: 1,
    title: "1. Hozirgi joylashuvni aniqlash",
    command: "pwd",
    description: "Linux tizimida ayni paytda qaysi papka (katalog)da turganingizni bilish eng muhim boshlang'ich qadamdir.",
    task: "`pwd` (print working directory) buyrug'ini yozing va joriy papka yo'lini ko'ring.",
    hint: "Terminalga shunchaki `pwd` deb yozing va Enter tugmasini bosing.",
    validate: (cmd) => {
      const parts = cmd.trim().toLowerCase().split(/\s+/);
      return parts[0] === "pwd";
    },
  },
  {
    id: 2,
    title: "2. Papkadagi fayllarni ko'rish",
    command: "ls",
    description: "`ls` (list) buyrug'i joriy katalog ichidagi barcha ko'rinadigan fayllar va papkalar ro'yxatini chiqarib beradi.",
    task: "Hozirgi papkada qanday fayllar borligini ko'rish uchun `ls` buyrug'ini yozing.",
    hint: "Terminalga `ls` deb yozing va Enter bosing.",
    validate: (cmd) => {
      const parts = cmd.trim().toLowerCase().split(/\s+/);
      return parts[0] === "ls" && (!parts[1] || parts[1] === "." || !parts[1].startsWith("-"));
    },
  },
  {
    id: 3,
    title: "3. Yashirin fayllar va tafsilotlar",
    command: "ls -la",
    description: "Linuxda nuqta (.) bilan boshlanadigan fayllar yashirin hisoblanadi. `-l` (batafsil ro'yxat) va `-a` (barcha, shu jumladan yashirin) flaglari birga ishlatiladi.",
    task: "Barcha fayllarni (yashirinlari bilan) to'liq tafsiloti bilan ko'rish uchun `ls -la` buyrug'ini yozing.",
    hint: "`ls -la` yoki `ls -al` yozing. Bo'shliqni unutmang!",
    validate: (cmd) => {
      const c = cmd.trim().toLowerCase().replace(/\s+/g, " ");
      return c.startsWith("ls") && (c.includes("-la") || c.includes("-al") || (c.includes("-a") && c.includes("-l")));
    },
  },
  {
    id: 4,
    title: "4. Yangi papka ochish",
    command: "mkdir loyihalar",
    description: "`mkdir` (make directory) yangi papka yaratish uchun xizmat qiladi.",
    task: "Yangi loyihalaringiz uchun `loyihalar` nomli papka yarating.",
    hint: "`mkdir loyihalar` deb yozing va Enter bosing.",
    validate: (cmd, fs) => {
      const parts = cmd.trim().split(/\s+/);
      if (parts[0] === "mkdir" && parts[1]?.replace(/['"]/g, "").replace(/\/$/, "") === "loyihalar") {
        return true;
      }
      // Shuningdek, agar papka oldindan yaratilgan bo'lsa ham qabul qilish
      const node = fs.getNode("loyihalar") || fs.getNode("/home/user/loyihalar");
      return !!node;
    },
  },
  {
    id: 5,
    title: "5. Papka ichiga kirish",
    command: "cd loyihalar",
    description: "`cd` (change directory) orqali boshqa papkaga o'tiladi.",
    task: "Boyagina yaratilgan `loyihalar` papkasi ichiga kiring.",
    hint: "`cd loyihalar` deb yozing.",
    validate: (cmd, fs, cwd) => {
      const parts = cmd.trim().split(/\s+/);
      return (parts[0] === "cd" && (parts[1]?.replace(/['"]/g, "").replace(/\/$/, "") === "loyihalar" || parts[1] === "./loyihalar")) || cwd.endsWith("/loyihalar");
    },
  },
  {
    id: 6,
    title: "6. Yangi bo'sh fayl yaratish",
    command: "touch index.html",
    description: "`touch` buyrug'i mavjud bo'lmagan yangi bo'sh fayl yaratadi yoki mavjud faylning so'nggi o'zgartirilgan vaqtini yangilaydi.",
    task: "`index.html` nomli yangi veb-fayl yarating.",
    hint: "`touch index.html` deb yozing.",
    validate: (cmd, fs) => {
      const parts = cmd.trim().split(/\s+/);
      if (parts[0] === "touch" && parts.some(p => p.includes("index.html"))) return true;
      const fileNode = fs.getNode("index.html") || fs.getNode("/home/user/loyihalar/index.html");
      return !!fileNode;
    },
  },
  {
    id: 7,
    title: "7. Faylga matn yozish",
    command: 'echo "Salom Dunyo" > index.html',
    description: "`echo` matnni ekranga chiqaradi, `>` esa ushbu chiqishni fayl ichiga yo'naltiradi (faylni qayta yozadi).",
    task: '`index.html` fayli ichiga `echo "Salom Dunyo" > index.html` orqali matn yozing.',
    hint: '`echo "Salom Dunyo" > index.html` deb yozing (qo\'shtirnoqlar bilan).',
    validate: (cmd, fs) => {
      const isEcho = cmd.includes("echo") && cmd.includes(">") && cmd.includes("index.html");
      const file = fs.getNode("index.html") || fs.getNode("/home/user/loyihalar/index.html");
      return isEcho || (file && file.content && file.content.trim().length > 0);
    },
  },
  {
    id: 8,
    title: "8. Fayl tarkibini o'qish",
    command: "cat index.html",
    description: "`cat` (concatenate) fayl tarkibini terminal ekraniga to'g'ridan-to'g'ri chiqarib beradi.",
    task: "`index.html` faylidagi matnni ko'rish uchun `cat index.html` buyrug'ini yozing.",
    hint: "`cat index.html` deb yozing va natijani ko'ring.",
    validate: (cmd) => {
      const parts = cmd.trim().split(/\s+/);
      return parts[0] === "cat" && parts.some(p => p.includes("index.html"));
    },
  },
  {
    id: 9,
    title: "9. Fayldan nusxa ko'chirish",
    command: "cp index.html backup.html",
    description: "`cp` (copy) buyrug'i fayl yoki papkadan nusxa olish uchun xizmat qiladi.",
    task: "`index.html` faylidan nusxa olib, yangi `backup.html` faylini hosil qiling.",
    hint: "`cp index.html backup.html` deb yozing.",
    validate: (cmd, fs) => {
      const parts = cmd.trim().split(/\s+/);
      if (parts[0] === "cp" && parts.includes("backup.html")) return true;
      const bFile = fs.getNode("backup.html") || fs.getNode("/home/user/loyihalar/backup.html");
      return !!bFile;
    },
  },
  {
    id: 10,
    title: "10. Fayl nomini o'zgartirish",
    command: "mv backup.html arxiv.html",
    description: "`mv` (move) buyrug'i faylni boshqa joyga ko'chirish yoki shunchaki uning nomini o'zgartirish uchun ishlatiladi.",
    task: "`backup.html` faylining nomini `arxiv.html` ga o'zgartiring.",
    hint: "`mv backup.html arxiv.html` deb yozing.",
    validate: (cmd, fs) => {
      const parts = cmd.trim().split(/\s+/);
      if (parts[0] === "mv" && parts.includes("arxiv.html")) return true;
      const aFile = fs.getNode("arxiv.html") || fs.getNode("/home/user/loyihalar/arxiv.html");
      return !!aFile;
    },
  },
  {
    id: 11,
    title: "11. Bitta yuqori papkaga qaytish",
    command: "cd ..",
    description: "Linuxda `..` (ikkita nuqta) har doim ota papkani (bitta yuqori darajani) bildiradi.",
    task: "Orqaga, asosiy `~` (home) papkaga qaytish uchun `cd ..` buyrug'ini bering.",
    hint: "`cd ..` deb yozing (cd va .. orasida bitta bo'sh joy bo'lishi shart).",
    validate: (cmd, fs, cwd) => {
      const parts = cmd.trim().split(/\s+/);
      return (parts[0] === "cd" && (parts[1] === ".." || parts[1] === "~" || !parts[1])) || cwd === "/home/user";
    },
  },
  {
    id: 12,
    title: "12. Faylni o'chirish",
    command: "rm loyihalar/arxiv.html",
    description: "`rm` (remove) buyrug'i fayllarni o'chirish uchun ishlatiladi. Ehtiyot bo'ling, Linuxda `rm` orqali o'chirilgan fayllar axlat qutisiga tushmaydi, butunlay o'chadi!",
    task: "`loyihalar` ichidagi `arxiv.html` faylini o'chiring: `rm loyihalar/arxiv.html`",
    hint: "`rm loyihalar/arxiv.html` deb yozing.",
    validate: (cmd, fs) => {
      const parts = cmd.trim().split(/\s+/);
      return parts[0] === "rm" && parts.some(p => p.includes("arxiv.html"));
    },
  },
  {
    id: 13,
    title: "13. Tizim foydalanuvchisini bilish",
    command: "whoami",
    description: "`whoami` (who am i) buyrug'i joriy tizimda qaysi foydalanuvchi hisobidan kirilganini aytadi.",
    task: "Siz qaysi foydalanuvchi sifatida ishlayotganingizni bilish uchun `whoami` deb yozing.",
    hint: "Terminalga `whoami` deb yozing va Enter bosing.",
    validate: (cmd) => {
      const parts = cmd.trim().toLowerCase().split(/\s+/);
      return parts[0] === "whoami";
    },
  },
  {
    id: 14,
    title: "14. Vaqt va sanani tekshirish",
    command: "date",
    description: "`date` buyrug'i serverning joriy tizim vaqti, sanasi va vaqt mintaqasini ko'rsatadi.",
    task: "Joriy sana va vaqtni bilish uchun `date` buyrug'ini bering.",
    hint: "`date` deb yozing.",
    validate: (cmd) => {
      const parts = cmd.trim().toLowerCase().split(/\s+/);
      return parts[0] === "date";
    },
  },
  {
    id: 15,
    title: "15. Terminalni tozalash",
    command: "clear",
    description: "`clear` buyrug'i (yoki `Ctrl + L`) to'lib ketgan terminal oynasini tozalab, ekranni boshlang'ich qulay holatga keltiradi.",
    task: "Ekranni tozalash va kursni g'olibona yakunlash uchun `clear` buyrug'ini bering!",
    hint: "Terminalga `clear` deb yozing va Enter bosing.",
    validate: (cmd) => {
      const parts = cmd.trim().toLowerCase().split(/\s+/);
      return parts[0] === "clear";
    },
  },
];

export const cheatSheetData = [
  {
    category: "Navigatsiya",
    commands: [
      { cmd: "pwd", desc: "Hozir qaysi papkada turganingizni ko'rsatadi" },
      { cmd: "ls", desc: "Papkadagi fayllar ro'yxatini chiqaradi" },
      { cmd: "ls -la", desc: "Yashirin fayllar va to'liq ruxsatlarni ko'rsatadi" },
      { cmd: "cd <papka>", desc: "Ko'rsatilgan papka ichiga kiradi" },
      { cmd: "cd ..", desc: "Bitta qadam orqaga (ota papkaga) qaytadi" },
      { cmd: "cd ~", desc: "Boshlang'ich uy (home) katalogiga qaytadi" },
    ]
  },
  {
    category: "Fayl va Papkalar",
    commands: [
      { cmd: "mkdir <nomi>", desc: "Yangi papka (directory) yaratadi" },
      { cmd: "touch <fayl>", desc: "Yangi bo'sh fayl yaratadi" },
      { cmd: "cp <manba> <nusxa>", desc: "Fayldan nusxa oladi" },
      { cmd: "mv <eski> <yangi>", desc: "Fayl nomini o'zgartiradi yoki ko'chiradi" },
      { cmd: "rm <fayl>", desc: "Faylni butunlay o'chiradi" },
      { cmd: "rm -r <papka>", desc: "Papkani barcha ichidagi fayllari bilan o'chiradi" },
    ]
  },
  {
    category: "Matn va Tizim",
    commands: [
      { cmd: "cat <fayl>", desc: "Fayl tarkibini ekranda o'qiydi" },
      { cmd: 'echo "matn" > f.txt', desc: "Matnni yangi faylga yozadi" },
      { cmd: "whoami", desc: "Joriy login qilgan foydalanuvchi nomi" },
      { cmd: "date", desc: "Joriy sana va aniq vaqt" },
      { cmd: "clear", desc: "Terminal oynasini tozalaydi" },
      { cmd: "history", desc: "Oldin kiritilgan buyruqlar tarixi" },
    ]
  }
];
