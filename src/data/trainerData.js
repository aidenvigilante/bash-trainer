// Tuxedo OS Bash Trenajyori — 45 ta to'liq bosqichli topshiriqlar

export const stages = [
  // ================= 1-BOSQICH: ASOSLAR (1-15) =================
  {
    id: 1,
    title: "1. Hozirgi joylashuvni aniqlash",
    command: "pwd",
    description: "Linux tizimida ayni paytda qaysi papka (katalog)da turganingizni bilish eng muhim boshlang'ich qadamdir.",
    task: "`pwd` (print working directory) buyrug'ini yozing va joriy papka yo'lini ko'ring.",
    hint: "Terminalga shunchaki `pwd` deb yozing va Enter tugmasini bosing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "pwd",
  },
  {
    id: 2,
    title: "2. Papkadagi fayllarni ko'rish",
    command: "ls",
    description: "`ls` (list) buyrug'i joriy katalog ichidagi barcha ko'rinadigan fayllar va papkalar ro'yxatini chiqarib beradi.",
    task: "Hozirgi papkada qanday fayllar borligini ko'rish uchun `ls` buyrug'ini yozing.",
    hint: "Terminalga `ls` deb yozing va Enter bosing.",
    validate: (cmd) => {
      const p = cmd.trim().toLowerCase().split(/\s+/);
      return p[0] === "ls" && (!p[1] || p[1] === "." || !p[1].startsWith("-"));
    },
  },
  {
    id: 3,
    title: "3. Yashirin fayllar va ruxsatlar",
    command: "ls -la",
    description: "Linuxda nuqta (.) bilan boshlanadigan fayllar yashirin hisoblanadi. `-l` (batafsil) va `-a` (barcha) flaglari yordamida to'liq ko'rish mumkin.",
    task: "Barcha fayllarni (yashirinlari bilan) batafsil ko'rish uchun `ls -la` buyrug'ini yozing.",
    hint: "`ls -la` yoki `ls -al` yozing.",
    validate: (cmd) => {
      const c = cmd.trim().toLowerCase();
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
      if (parts[0] === "mkdir" && parts[1]?.replace(/['"]/g, "").replace(/\/$/, "") === "loyihalar") return true;
      return !!fs.getNode("loyihalar");
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
    description: "`touch` buyrug'i yangi bo'sh fayl yaratadi.",
    task: "`index.html` nomli yangi veb-fayl yarating.",
    hint: "`touch index.html` deb yozing.",
    validate: (cmd, fs) => {
      const parts = cmd.trim().split(/\s+/);
      if (parts[0] === "touch" && parts.some(p => p.includes("index.html"))) return true;
      return !!fs.getNode("index.html") || !!fs.getNode("/home/user/loyihalar/index.html");
    },
  },
  {
    id: 7,
    title: "7. Faylga matn yozish",
    command: 'echo "Salom Dunyo" > index.html',
    description: "`echo` matnni ekranga chiqaradi, `>` esa ushbu chiqishni faylga yo'naltiradi.",
    task: '`index.html` fayliga matn yozing: `echo "Salom Dunyo" > index.html`',
    hint: '`echo "Salom Dunyo" > index.html` deb yozing.',
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
    description: "`cat` (concatenate) fayl ichidagi matnni terminalga chiqarib beradi.",
    task: "`index.html` tarkibini ko'rish uchun `cat index.html` buyrug'ini bering.",
    hint: "`cat index.html` deb yozing.",
    validate: (cmd) => {
      const parts = cmd.trim().split(/\s+/);
      return parts[0] === "cat" && parts.some(p => p.includes("index.html"));
    },
  },
  {
    id: 9,
    title: "9. Fayldan nusxa ko'chirish",
    command: "cp index.html backup.html",
    description: "`cp` (copy) buyrug'i fayldan nusxa oladi.",
    task: "`index.html` faylidan nusxa olib, yangi `backup.html` faylini yarating.",
    hint: "`cp index.html backup.html` deb yozing.",
    validate: (cmd, fs) => {
      const parts = cmd.trim().split(/\s+/);
      if (parts[0] === "cp" && parts.includes("backup.html")) return true;
      return !!fs.getNode("backup.html") || !!fs.getNode("/home/user/loyihalar/backup.html");
    },
  },
  {
    id: 10,
    title: "10. Fayl nomini o'zgartirish",
    command: "mv backup.html arxiv.html",
    description: "`mv` (move) faylni ko'chirish yoki qayta nomlash uchun ishlatiladi.",
    task: "`backup.html` faylining nomini `arxiv.html` ga o'zgartiring.",
    hint: "`mv backup.html arxiv.html` deb yozing.",
    validate: (cmd, fs) => {
      const parts = cmd.trim().split(/\s+/);
      if (parts[0] === "mv" && parts.includes("arxiv.html")) return true;
      return !!fs.getNode("arxiv.html") || !!fs.getNode("/home/user/loyihalar/arxiv.html");
    },
  },
  {
    id: 11,
    title: "11. Bitta yuqori papkaga qaytish",
    command: "cd ..",
    description: "`..` har doim ota (yuqori) katalogga ishora qiladi.",
    task: "Orqaga, asosiy `~` (home) papkaga qaytish uchun `cd ..` buyrug'ini bering.",
    hint: "`cd ..` deb yozing.",
    validate: (cmd, fs, cwd) => {
      const parts = cmd.trim().split(/\s+/);
      return (parts[0] === "cd" && (parts[1] === ".." || parts[1] === "~" || !parts[1])) || cwd === "/home/user";
    },
  },
  {
    id: 12,
    title: "12. Faylni o'chirish",
    command: "rm loyihalar/arxiv.html",
    description: "`rm` faylni butunlay o'chirib tashlaydi.",
    task: "`loyihalar` ichidagi `arxiv.html` faylini o'chiring: `rm loyihalar/arxiv.html`",
    hint: "`rm loyihalar/arxiv.html` deb yozing.",
    validate: (cmd) => {
      const parts = cmd.trim().split(/\s+/);
      return parts[0] === "rm" && parts.some(p => p.includes("arxiv.html"));
    },
  },
  {
    id: 13,
    title: "13. Tizim foydalanuvchisini bilish",
    command: "whoami",
    description: "`whoami` buyrug'i tizimdagi joriy foydalanuvchi hisobini ko'rsatadi.",
    task: "Qaysi hisobdan kirganingizni bilish uchun `whoami` deb yozing.",
    hint: "`whoami` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "whoami",
  },
  {
    id: 14,
    title: "14. Vaqt va sanani tekshirish",
    command: "date",
    description: "`date` buyrug'i serverning joriy vaqtini ko'rsatadi.",
    task: "Joriy sana va vaqtni bilish uchun `date` buyrug'ini bering.",
    hint: "`date` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "date",
  },
  {
    id: 15,
    title: "15. Terminalni tozalash",
    command: "clear",
    description: "`clear` terminal ekranini tozalaydi.",
    task: "Terminal ekranini tozalash uchun `clear` buyrug'ini bering.",
    hint: "`clear` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "clear",
  },

  // ================= 2-BOSQICH: MATN VA FILTRLAR (16-30) =================
  {
    id: 16,
    title: "16. Faylning boshidan 3 qator o'qish (head)",
    command: "head -n 3 ismlar.txt",
    description: "`head` buyrug'i katta fayllarning eng birinchi qatorlarini tez ko'rish uchun ishlatiladi.",
    task: "`ismlar.txt` faylining birinchi 3 qatorini ko'rish uchun `head -n 3 ismlar.txt` deb yozing.",
    hint: "`head -n 3 ismlar.txt` deb yozing.",
    validate: (cmd) => {
      const c = cmd.trim();
      return c.startsWith("head") && c.includes("3") && c.includes("ismlar.txt");
    },
  },
  {
    id: 17,
    title: "17. Faylning oxirgi qatorlarini o'qish (tail)",
    command: "tail -n 2 ismlar.txt",
    description: "`tail` buyrug'i faylning oxirgi qatorlarini (masalan, server loglarining yangi xabarlarini) o'qish uchun juda mashhur.",
    task: "`ismlar.txt` faylining eng oxirgi 2 qatorini `tail -n 2 ismlar.txt` orqali ko'ring.",
    hint: "`tail -n 2 ismlar.txt` deb yozing.",
    validate: (cmd) => {
      const c = cmd.trim();
      return c.startsWith("tail") && c.includes("2") && c.includes("ismlar.txt");
    },
  },
  {
    id: 18,
    title: "18. Matn ichidan qidirish (grep)",
    command: "grep ERROR logs/server.log",
    description: "`grep` (Global Regular Expression Print) fayllar ichidan kerakli so'z yoki xatolikni bir zumda topib beradi.",
    task: "`logs/server.log` faylidan barcha `ERROR` so'zi bor qatorlarni qidiring.",
    hint: "`grep ERROR logs/server.log` deb yozing.",
    validate: (cmd) => {
      const c = cmd.trim();
      return c.startsWith("grep") && c.includes("ERROR") && c.includes("server.log");
    },
  },
  {
    id: 19,
    title: "19. Registrga qaramasdan qidirish (grep -i)",
    command: "grep -i 'warn' logs/server.log",
    description: "`-i` flagi katta-kichik harflarga qaramasdan qidirishga imkon beradi (ignore case).",
    task: "Katta yoki kichik harflarga qaramasdan `logs/server.log` ichidan 'warn' so'zini toping: `grep -i warn logs/server.log`",
    hint: "`grep -i warn logs/server.log` deb yozing.",
    validate: (cmd) => {
      const c = cmd.trim();
      return c.startsWith("grep") && c.includes("-i") && c.toLowerCase().includes("warn");
    },
  },
  {
    id: 20,
    title: "20. Fayldagi qatorlar sonini sanash (wc -l)",
    command: "wc -l ismlar.txt",
    description: "`wc -l` (word count lines) faylda jami nechta qator mavjudligini sanaydi.",
    task: "`ismlar.txt` faylida nechta qator borligini bilish uchun `wc -l ismlar.txt` buyrug'ini yozing.",
    hint: "`wc -l ismlar.txt` deb yozing.",
    validate: (cmd) => {
      const c = cmd.trim();
      return c.startsWith("wc") && c.includes("-l") && c.includes("ismlar.txt");
    },
  },
  {
    id: 21,
    title: "21. Ro'yxatni alifbo bo'yicha saralash (sort)",
    command: "sort ismlar.txt",
    description: "`sort` buyrug'i qatorlarni A dan Z gacha alifbo bo'yicha tartiblab beradi.",
    task: "`ismlar.txt` faylidagi ismlarni alifbo bo'yicha tartiblash uchun `sort ismlar.txt` yozing.",
    hint: "`sort ismlar.txt` deb yozing.",
    validate: (cmd) => cmd.trim().startsWith("sort") && cmd.includes("ismlar.txt"),
  },
  {
    id: 22,
    title: "22. Quvurlar (Pipe |) orqali buyruqlarni ulash",
    command: "cat ismlar.txt | sort",
    description: "Linuxda quvur belgisi `|` (pipe) birinchi buyruqning chiqishini ikkinchi buyruqqa kirish qilib uzatadi.",
    task: "`cat ismlar.txt | sort` buyrug'ini yozib, matnni o'qib darhol saralang.",
    hint: "`cat ismlar.txt | sort` deb yozing (`|` belgisini Shift + \\ orqali qo'yishingiz mumkin).",
    validate: (cmd) => {
      const c = cmd.trim();
      return c.includes("|") && c.includes("ismlar.txt") && c.includes("sort");
    },
  },
  {
    id: 23,
    title: "23. Faylni o'chirmasdan matn qo'shish (>>)",
    command: 'echo "Nodir" >> ismlar.txt',
    description: "`>` faylni butunlay qayta yozadi, lekin `>>` (ikkita katta belgisi) faylning oxiriga yangi qator qo'shadi.",
    task: '`ismlar.txt` faylining oxiriga yangi ismni qo\'shing: `echo "Nodir" >> ismlar.txt`',
    hint: '`echo "Nodir" >> ismlar.txt` deb yozing.',
    validate: (cmd) => cmd.includes(">>") && cmd.includes("ismlar.txt"),
  },
  {
    id: 24,
    title: "24. Tizim bo'ylab fayl qidirish (find)",
    command: "find . -name '*.log'",
    description: "`find` buyrug'i joriy papka va uning barcha ichki kataloglaridan fayllarni nomi bo'yicha qidiradi.",
    task: "Joriy joylashuvdagi barcha log fayllarni topish uchun `find . -name '*.log'` deb yozing.",
    hint: "`find . -name '*.log'` yoki `find . -name *.log` deb yozing.",
    validate: (cmd) => {
      const c = cmd.trim();
      return c.startsWith("find") && c.includes("-name") && c.includes(".log");
    },
  },
  {
    id: 25,
    title: "25. Faylga ijro ruxsatini berish (chmod +x)",
    command: "chmod +x script.sh",
    description: "Linuxda skriptlar dastur sifatida ishlashi uchun ularga `+x` (executable — ishga tushirish) ruxsati berilishi kerak.",
    task: "`script.sh` faylini ishga tushirish huquqini berish uchun `chmod +x script.sh` buyrug'ini yozing.",
    hint: "`chmod +x script.sh` deb yozing.",
    validate: (cmd, fs) => {
      const c = cmd.trim();
      if (c.startsWith("chmod") && (c.includes("+x") || c.includes("755")) && c.includes("script.sh")) return true;
      const f = fs.getNode("script.sh");
      return f && f.permissions && f.permissions.includes("x");
    },
  },
  {
    id: 26,
    title: "26. Fayl ruxsatini cheklash (chmod 600)",
    command: "chmod 600 README.txt",
    description: "`600` ruxsati faylni faqat uning egasi o'qiy va yozishi mumkinligini bildiradi (boshqalar uchun yopiq). SSH kalitlarida doim 600 ishlatiladi.",
    task: "`README.txt` fayliga shaxsiy `600` ruxsatini bering: `chmod 600 README.txt`",
    hint: "`chmod 600 README.txt` deb yozing.",
    validate: (cmd) => cmd.trim().startsWith("chmod") && cmd.includes("600") && cmd.includes("README.txt"),
  },
  {
    id: 27,
    title: "27. Tuxedo OS versiyasini ko'rish (/etc/os-release)",
    command: "cat /etc/os-release",
    description: "Linux distrolarida aynan qaysi OS va qaysi versiya o'rnatilgani `/etc/os-release` faylida saqlanadi.",
    task: "Tuxedo OS tizim ma'lumotlarini ko'rish uchun `cat /etc/os-release` deb yozing.",
    hint: "`cat /etc/os-release` deb yozing.",
    validate: (cmd) => cmd.trim().startsWith("cat") && cmd.includes("/etc/os-release"),
  },
  {
    id: 28,
    title: "28. Kompyuter nomini bilish (hostname)",
    command: "hostname",
    description: "`hostname` server yoki kompyuterning tarmoqdagi nomini chiqaradi.",
    task: "Kompyuter nomini bilish uchun `hostname` deb yozing.",
    hint: "`hostname` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "hostname",
  },
  {
    id: 29,
    title: "29. Linux yadrosi (Kernel) versiyasi (uname -a)",
    command: "uname -a",
    description: "`uname -a` operatsion tizim yadrosi (Kernel versiyasi, arxitektura) haqida to'liq ma'lumot beradi.",
    task: "Linux yadrosi tafsilotlarini ko'rish uchun `uname -a` buyrug'ini bering.",
    hint: "`uname -a` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().startsWith("uname") && cmd.includes("-a"),
  },
  {
    id: 30,
    title: "30. Qidiruv natijasini faylga saqlash",
    command: "grep ERROR logs/server.log > errors.txt",
    description: "Server xatolarini alohida faylga ajratib olish — dasturchilarning har kungi amaliyotidir.",
    task: "`logs/server.log` ichidagi xatoliklarni yangi `errors.txt` fayliga yozing: `grep ERROR logs/server.log > errors.txt`",
    hint: "`grep ERROR logs/server.log > errors.txt` deb yozing.",
    validate: (cmd, fs) => {
      const c = cmd.trim();
      return (c.includes("grep") && c.includes("ERROR") && c.includes(">") && c.includes("errors.txt")) || !!fs.getNode("errors.txt");
    },
  },

  // ================= 3-BOSQICH: HARDCORE & ADMIN (31-45) =================
  {
    id: 31,
    title: "31. Ishlayotgan jarayonlarni ko'rish (ps aux)",
    command: "ps aux",
    description: "`ps aux` tizimda fonda ishlab turgan har bir dastur va xizmatning PID raqami, xotira va CPU iste'molini ko'rsatadi.",
    task: "Barcha ishlayotgan jarayonlarni ko'rish uchun `ps aux` deb yozing.",
    hint: "`ps aux` yoki `ps` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().startsWith("ps"),
  },
  {
    id: 32,
    title: "32. Jarayonlar orasidan grep orqali topish",
    command: "ps aux | grep nginx",
    description: "Yuzlab jarayonlar orasidan aynan kerakli dasturni topish uchun `ps aux | grep <nom>` usuli ishlatiladi.",
    task: "`ps aux | grep nginx` buyrug'ini yozib, nginx jarayonini toping.",
    hint: "`ps aux | grep nginx` deb yozing.",
    validate: (cmd) => cmd.includes("ps") && cmd.includes("|") && cmd.includes("grep") && cmd.includes("nginx"),
  },
  {
    id: 33,
    title: "33. Osilib qolgan jarayonni o'ldirish (kill)",
    command: "kill 3140",
    description: "`kill <PID>` buyrug'i protsessorni 98% ga yuklayotgan keraksiz dasturni to'xtatadi.",
    task: "`3140` PID raqamli `stress-test` jarayonini to'xtatish uchun `kill 3140` buyrug'ini bering.",
    hint: "`kill 3140` deb yozing.",
    validate: (cmd, fs) => {
      const c = cmd.trim();
      if (c.startsWith("kill") && c.includes("3140")) return true;
      return !fs.processes.some(p => p.pid === 3140);
    },
  },
  {
    id: 34,
    title: "34. Operativ xotirani (RAM) ko'rish (free -h)",
    command: "free -h",
    description: "`free -h` (human readable) tizimda qancha RAM bo'sh va qancha ishlatilayotganini GB/MB larda tushunarli ko'rsatadi.",
    task: "RAM xotira holatini ko'rish uchun `free -h` deb yozing.",
    hint: "`free -h` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().startsWith("free"),
  },
  {
    id: 35,
    title: "35. Qattiq disk xotirasini tekshirish (df -h)",
    command: "df -h",
    description: "`df -h` (disk free) barcha disklarning umumiy hajmi va qolgan bo'sh joyini foizlarda ko'rsatadi.",
    task: "Disk xotirasini tahlil qilish uchun `df -h` buyrug'ini bering.",
    hint: "`df -h` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().startsWith("df"),
  },
  {
    id: 36,
    title: "36. Serverning qancha vaqt yoqilganini bilish (uptime)",
    command: "uptime",
    description: "`uptime` server qachon yoqilgani va unga tushayotgan yuklama (load average)ni chiqaradi.",
    task: "Server uzluksiz qancha vaqt ishlayotganini ko'rish uchun `uptime` deb yozing.",
    hint: "`uptime` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "uptime",
  },
  {
    id: 37,
    title: "37. Papkani arxivlash (tar -czvf)",
    command: "tar -czvf backup.tar.gz loyihalar",
    description: "`tar -czvf` fayl va kataloglarni ixcham `.tar.gz` arxiviga siqadi. Zaxira nusxa (backup) olishda eng asosiy buyruq.",
    task: "`loyihalar` papkasini `backup.tar.gz` qilib arxivlang: `tar -czvf backup.tar.gz loyihalar`",
    hint: "`tar -czvf backup.tar.gz loyihalar` deb yozing.",
    validate: (cmd, fs) => {
      const c = cmd.trim();
      return (c.startsWith("tar") && c.includes("backup.tar.gz")) || !!fs.getNode("backup.tar.gz");
    },
  },
  {
    id: 38,
    title: "38. Tarmoq aloqasini tekshirish (ping)",
    command: "ping 8.8.8.8",
    description: "`ping` ko'rsatilgan serverga paketlar yuborib, internet va server bilan aloqa bormi-yo'qligini tekshiradi.",
    task: "Google DNS (8.8.8.8) serveri bilan aloqani tekshirish uchun `ping 8.8.8.8` deb yozing.",
    hint: "`ping 8.8.8.8` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().startsWith("ping"),
  },
  {
    id: 39,
    title: "39. Veb-sahifani yuklab olish va tekshirish (curl)",
    command: "curl https://tuxedocomputers.com",
    description: "`curl` orqali API yoki veb-saytga to'g'ridan-to'g'ri terminaldan so'rov yuborish mumkin.",
    task: "`curl https://tuxedocomputers.com` buyrug'i orqali veb-sahifa javobini oling.",
    hint: "`curl https://tuxedocomputers.com` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().startsWith("curl"),
  },
  {
    id: 40,
    title: "40. Atrof-muhit o'zgaruvchilari (env)",
    command: "env",
    description: "`env` tizimda o'rnatilgan global o'zgaruvchilar (USER, HOME, PATH, SHELL) ro'yxatini chiqaradi.",
    task: "Barcha tizim o'zgaruvchilarini ko'rish uchun `env` deb yozing.",
    hint: "`env` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "env",
  },
  {
    id: 41,
    title: "41. Yangi global o'zgaruvchi yaratish (export)",
    command: "export APP_ENV=production",
    description: "`export` yordamida dasturlar uchun maxsus parametrlar (masalan: `APP_ENV=production`) o'rnatiladi.",
    task: "`export APP_ENV=production` buyrug'i orqali yangi o'zgaruvchi e'lon qiling.",
    hint: "`export APP_ENV=production` deb yozing.",
    validate: (cmd, fs) => {
      const c = cmd.trim();
      return (c.startsWith("export") && c.includes("APP_ENV")) || fs.env["APP_ENV"] === "production";
    },
  },
  {
    id: 42,
    title: "42. Yaratilgan o'zgaruvchini ekranga chiqarish",
    command: "echo $APP_ENV",
    description: "Linuxda o'zgaruvchi qiymatini olish uchun uning nomidan oldin `$` belgisi qo'yiladi.",
    task: "Boyagina yaratilgan o'zgaruvchini ko'rish uchun `echo $APP_ENV` deb yozing.",
    hint: "`echo $APP_ENV` deb yozing.",
    validate: (cmd) => cmd.trim().includes("echo") && cmd.includes("$APP_ENV"),
  },
  {
    id: 43,
    title: "43. Logdan muvaffaqiyatli (200 OK) so'rovlarni sanash",
    command: "grep 200 logs/access.log | wc -l",
    description: "Haqiqiy server tahlili: `grep` orqali 200 javoblarini olib, `wc -l` bilan sonini sanash.",
    task: "`logs/access.log` ichidagi 200 kodli so'rovlar sonini sanang: `grep 200 logs/access.log | wc -l`",
    hint: "`grep 200 logs/access.log | wc -l` deb yozing.",
    validate: (cmd) => cmd.includes("grep") && cmd.includes("200") && cmd.includes("|") && cmd.includes("wc"),
  },
  {
    id: 44,
    title: "44. Terminal buyruqlar tarixini ko'rish (history)",
    command: "history",
    description: "`history` siz ilgari kiritgan barcha buyruqlar xotirasini raqamlari bilan ko'rsatadi.",
    task: "Buyruqlar tarixini ochish uchun `history` deb yozing.",
    hint: "`history` deb yozing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "history",
  },
  {
    id: 45,
    title: "45. Tuxedo OS Terminalini tozalash va yakunlash",
    command: "clear",
    description: "Siz Tuxedo OS tizimida eng muhim 45 ta buyruq va usullarni professional darajada o'rgandingiz!",
    task: "Ekranni tozalab, 45 ta vazifadan iborat 'Tuxedo OS Bash' kursini g'olibona yakunlang: `clear`",
    hint: "`clear` deb yozing va Enter bosing.",
    validate: (cmd) => cmd.trim().toLowerCase().split(/\s+/)[0] === "clear",
  },
];

export const cheatSheetData = [
  {
    category: "Navigatsiya va Tizim",
    commands: [
      { cmd: "pwd", desc: "Hozirgi to'liq yo'lni ko'rsatadi" },
      { cmd: "ls -la", desc: "Barcha fayllarni ruxsatlari bilan ko'rsatadi" },
      { cmd: "cd <papka>", desc: "Ko'rsatilgan katalogga o'tadi" },
      { cmd: "cd ..", desc: "Bitta qadam orqaga (ota papkaga) qaytadi" },
      { cmd: "whoami", desc: "Joriy foydalanuvchi nomi" },
      { cmd: "hostname", desc: "Kompyuter (host) nomi" },
      { cmd: "uname -a", desc: "Linux yadrosi tafsilotlari" },
      { cmd: "clear", desc: "Terminal ekranini tozalaydi" },
    ]
  },
  {
    category: "Fayllar va Matnlar",
    commands: [
      { cmd: "mkdir <nom>", desc: "Yangi papka yaratadi" },
      { cmd: "touch <fayl>", desc: "Yangi bo'sh fayl ochadi" },
      { cmd: "cat <fayl>", desc: "Fayl ichidagi matnni chiqaradi" },
      { cmd: "head -n 5 <f>", desc: "Faylning birinchi 5 qatorini o'qiydi" },
      { cmd: "tail -n 5 <f>", desc: "Faylning oxirgi 5 qatorini o'qiydi" },
      { cmd: "grep 'matn' <f>", desc: "Fayldan so'z qidiradi" },
      { cmd: "sort <fayl>", desc: "Qatorlarni alifbo bo'yicha tartiblaydi" },
      { cmd: "wc -l <fayl>", desc: "Fayldagi qatorlar sonini sanaydi" },
      { cmd: "chmod +x <f>", desc: "Faylga ishga tushirish ruxsatini beradi" },
      { cmd: "find . -name '*.log'", desc: "Fayllarni nomi bo'yicha qidiradi" },
    ]
  },
  {
    category: "Monitoring va Tarmoq",
    commands: [
      { cmd: "ps aux", desc: "Barcha ishlayotgan jarayonlar" },
      { cmd: "kill <PID>", desc: "Jarayonni PID raqami bilan to'xtatadi" },
      { cmd: "free -h", desc: "RAM xotira holatini ko'rsatadi" },
      { cmd: "df -h", desc: "Qattiq diskdagi bo'sh joy" },
      { cmd: "uptime", desc: "Server qancha vaqt ishlayotgani" },
      { cmd: "tar -czvf <a.tgz> <p>", desc: "Papkani siqib arxivlaydi" },
      { cmd: "ping <ip>", desc: "Tarmoq aloqasini tekshiradi" },
      { cmd: "curl <url>", desc: "Veb-sahifaga so'rov yuboradi" },
      { cmd: "cmd1 | cmd2", desc: "Quvur: 1-buyruq natijasini 2-siga uzatadi" },
    ]
  }
];
