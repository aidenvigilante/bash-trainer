// Virtual File System (VFS) va Bash Simulator Interpretatori (Tuxedo OS / Linux)

const DEFAULT_ROOT = {
  type: "dir",
  name: "/",
  children: {
    home: {
      type: "dir",
      name: "home",
      children: {
        user: {
          type: "dir",
          name: "user",
          permissions: "-rwxr-xr-x",
          children: {
            "README.txt": {
              type: "file",
              name: "README.txt",
              permissions: "-rw-r--r--",
              content: "Linux Terminal Trainer-ga xush kelibsiz! Tuxedo OS va Bash buyruqlarini o'zlashtiring.\n",
            },
            ".bashrc": {
              type: "file",
              name: ".bashrc",
              permissions: "-rw-r--r--",
              content: "# Tuxedo OS Bash Profile\nexport PS1='user@tuxedo-os:\\w\\$ '\nalias ll='ls -la'\n",
            },
            "hujjatlar": {
              type: "dir",
              name: "hujjatlar",
              permissions: "drwxr-xr-x",
              children: {
                "darslik.md": {
                  type: "file",
                  name: "darslik.md",
                  permissions: "-rw-r--r--",
                  content: "# Linux Asoslari\n1. Navigatsiya\n2. Fayllarni boshqarish\n3. Tuxedo OS sozlamalari\n",
                }
              }
            },
            "logs": {
              type: "dir",
              name: "logs",
              permissions: "drwxr-xr-x",
              children: {
                "server.log": {
                  type: "file",
                  name: "server.log",
                  permissions: "-rw-r--r--",
                  content: "INFO [10:00:01] System started\nINFO [10:00:15] Service nginx active\nWARN [10:02:40] High memory usage\nERROR [10:05:12] Database connection failed at port 5432\nINFO [10:06:00] Retrying connection\nERROR [10:07:33] Timeout connecting to database host\nINFO [10:08:00] Connection restored\n",
                },
                "access.log": {
                  type: "file",
                  name: "access.log",
                  permissions: "-rw-r--r--",
                  content: "192.168.1.10 - GET /index.html 200\n192.168.1.15 - POST /login 403\n192.168.1.10 - GET /style.css 200\n192.168.1.88 - GET /admin 404\n192.168.1.15 - POST /login 200\n192.168.1.200 - GET /api/data 500\n",
                }
              }
            },
            "script.sh": {
              type: "file",
              name: "script.sh",
              permissions: "-rw-r--r--",
              content: "#!/bin/bash\necho 'Salom, Tuxedo OS tizimidan!'\n",
            },
            "ismlar.txt": {
              type: "file",
              name: "ismlar.txt",
              permissions: "-rw-r--r--",
              content: "Zafar\nAlisher\nBobur\nJasur\nDiyor\nAnvar\n",
            }
          }
        }
      }
    },
    var: {
      type: "dir",
      name: "var",
      permissions: "drwxr-xr-x",
      children: {
        log: {
          type: "dir",
          name: "log",
          permissions: "drwxr-xr-x",
          children: {
            "syslog": {
              type: "file",
              name: "syslog",
              permissions: "-rw-r-----",
              content: "systemd[1]: Started Tuxedo Hardware Support Service.\nkernel: [    0.000000] Linux version 6.5.0-tuxedo\n",
            }
          }
        }
      }
    },
    etc: {
      type: "dir",
      name: "etc",
      permissions: "drwxr-xr-x",
      children: {
        "os-release": {
          type: "file",
          name: "os-release",
          permissions: "-rw-r--r--",
          content: "NAME=\"TUXEDO OS\"\nVERSION=\"3\"\nID=tuxedo\nID_LIKE=\"ubuntu debian\"\nPRETTY_NAME=\"TUXEDO OS 3\"\n",
        },
        "hostname": {
          type: "file",
          name: "hostname",
          permissions: "-rw-r--r--",
          content: "tuxedo-laptop\n",
        }
      }
    }
  }
};

export class VirtualFS {
  constructor(initialState = null) {
    if (initialState && initialState.root) {
      this.root = initialState.root;
      this.currentPath = initialState.currentPath || "/home/user";
    } else {
      this.root = JSON.parse(JSON.stringify(DEFAULT_ROOT));
      this.currentPath = "/home/user";
    }
    this.env = {
      USER: "user",
      HOME: "/home/user",
      SHELL: "/bin/bash",
      EDITOR: "nano",
      OS: "TUXEDO OS 3"
    };
    this.processes = [
      { pid: 1, user: "root", cpu: 0.0, mem: 0.1, time: "0:02", cmd: "/sbin/init" },
      { pid: 142, user: "root", cpu: 0.0, mem: 0.2, time: "0:00", cmd: "systemd-udevd" },
      { pid: 489, user: "user", cpu: 0.1, mem: 0.8, time: "0:05", cmd: "tuxedo-control-center" },
      { pid: 1024, user: "user", cpu: 0.0, mem: 0.4, time: "0:01", cmd: "bash" },
      { pid: 3140, user: "user", cpu: 98.5, mem: 14.2, time: "1:45", cmd: "stress-test" },
      { pid: 4096, user: "nginx", cpu: 0.0, mem: 1.1, time: "0:03", cmd: "nginx: worker process" }
    ];
  }

  toJSON() {
    return {
      root: this.root,
      currentPath: this.currentPath,
      processes: this.processes
    };
  }

  resolvePath(pathStr) {
    if (!pathStr || pathStr === ".") return this.currentPath;
    if (pathStr === "~") return "/home/user";
    if (pathStr.startsWith("~/")) {
      pathStr = "/home/user" + pathStr.slice(1);
    }

    let absolute;
    if (pathStr.startsWith("/")) {
      absolute = pathStr;
    } else {
      absolute = (this.currentPath === "/" ? "" : this.currentPath) + "/" + pathStr;
    }

    const parts = absolute.split("/").filter(Boolean);
    const resolved = [];
    for (const p of parts) {
      if (p === ".") continue;
      if (p === "..") {
        resolved.pop();
      } else {
        resolved.push(p);
      }
    }
    return "/" + resolved.join("/");
  }

  getNode(pathStr) {
    const abs = this.resolvePath(pathStr);
    if (abs === "/") return this.root;
    const parts = abs.split("/").filter(Boolean);
    let curr = this.root;
    for (const p of parts) {
      if (!curr.children || !curr.children[p]) return null;
      curr = curr.children[p];
    }
    return curr;
  }

  getParentNode(pathStr) {
    const abs = this.resolvePath(pathStr);
    const parts = abs.split("/").filter(Boolean);
    if (parts.length === 0) return null;
    const baseName = parts.pop();
    const parentPath = "/" + parts.join("/");
    const parentNode = this.getNode(parentPath);
    return { parentNode, baseName };
  }

  getDisplayPath() {
    if (this.currentPath === "/home/user") return "~";
    if (this.currentPath.startsWith("/home/user/")) {
      return "~" + this.currentPath.slice("/home/user".length);
    }
    return this.currentPath;
  }

  // Boshqaruvchi execute metodi (Pipes va Redirection-ni to'liq quvvatlaydi)
  execute(rawCommand) {
    const trimmed = rawCommand.trim();
    if (!trimmed) return { output: "", success: true, command: "" };

    // 1. Quvurlar (Pipe `|` qo'llab-quvvatlash)
    if (trimmed.includes("|")) {
      const stages = trimmed.split("|").map(s => s.trim());
      let inputData = "";
      let lastRes = { output: "", success: true };

      for (let i = 0; i < stages.length; i++) {
        lastRes = this.executeSingle(stages[i], inputData);
        if (!lastRes.success) return lastRes;
        inputData = lastRes.output;
      }
      return lastRes;
    }

    // 2. Faylga qo'shish `>>` va qayta yozish `>`
    if (trimmed.includes(">>")) {
      const [cmdPart, filePart] = trimmed.split(">>").map(s => s.trim());
      const res = this.executeSingle(cmdPart, "");
      if (!res.success) return res;
      this.appendToFile(filePart, res.output + (res.output.endsWith("\n") ? "" : "\n"));
      return { output: "", success: true };
    } else if (trimmed.includes(">")) {
      const [cmdPart, filePart] = trimmed.split(">").map(s => s.trim());
      const res = this.executeSingle(cmdPart, "");
      if (!res.success) return res;
      this.createOrWriteFile(filePart, res.output + (res.output.endsWith("\n") ? "" : "\n"));
      return { output: "", success: true };
    }

    return this.executeSingle(trimmed, "");
  }

  // Bitta buyruqni bajarish
  executeSingle(cmdStr, stdinData = "") {
    const args = cmdStr.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    if (args.length === 0) return { output: "", success: true };

    const mainCmd = args[0];
    const cleanArgs = args.slice(1).map(a => {
      if ((a.startsWith('"') && a.endsWith('"')) || (a.startsWith("'") && a.endsWith("'"))) {
        return a.slice(1, -1);
      }
      return a;
    });

    switch (mainCmd) {
      case "pwd":
        return { output: this.currentPath, success: true };

      case "whoami":
        return { output: this.env.USER, success: true };

      case "hostname":
        return { output: "tuxedo-laptop", success: true };

      case "date":
        return { output: new Date().toLocaleString("uz-UZ", { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', timeZoneName: 'short' }), success: true };

      case "clear":
        return { output: "", clear: true, success: true };

      case "echo":
        return { output: cleanArgs.join(" "), success: true };

      case "env":
        return {
          output: Object.entries(this.env).map(([k, v]) => `${k}=${v}`).join("\n"),
          success: true
        };

      case "export": {
        if (cleanArgs.length === 0) return this.executeSingle("env");
        cleanArgs.forEach(arg => {
          if (arg.includes("=")) {
            const [k, ...v] = arg.split("=");
            this.env[k] = v.join("=");
          }
        });
        return { output: "", success: true };
      }

      case "uname": {
        if (cleanArgs.includes("-a") || cleanArgs.includes("-r")) {
          return { output: "Linux tuxedo-laptop 6.5.0-tuxedo x86_64 GNU/Linux", success: true };
        }
        return { output: "Linux", success: true };
      }

      case "ls": {
        const hasA = cleanArgs.some(a => a.startsWith("-") && a.includes("a"));
        const hasL = cleanArgs.some(a => a.startsWith("-") && a.includes("l"));
        const targetPath = cleanArgs.find(a => !a.startsWith("-")) || ".";
        const node = this.getNode(targetPath);

        if (!node) {
          return { output: `ls: '${targetPath}': Bunday fayl yoki katalog mavjud emas`, success: false };
        }
        if (node.type === "file") {
          return { output: node.name, success: true };
        }

        let entries = Object.keys(node.children || {});
        if (!hasA) {
          entries = entries.filter(name => !name.startsWith("."));
        } else {
          entries = [".", "..", ...entries];
        }

        if (hasL) {
          const lines = entries.map(name => {
            let isDir = false;
            let size = 4096;
            let perms = "-rw-r--r--";
            if (name === "." || name === "..") {
              isDir = true;
              perms = "drwxr-xr-x";
            } else {
              isDir = node.children[name]?.type === "dir";
              perms = node.children[name]?.permissions || (isDir ? "drwxr-xr-x" : "-rw-r--r--");
              size = isDir ? 4096 : (node.children[name]?.content?.length || 0);
            }
            const dateStr = "Nov 17 12:00";
            return `${perms} 1 user user ${String(size).padStart(5, ' ')} ${dateStr} ${name}`;
          });
          return { output: `total ${entries.length * 4}\n` + lines.join("\n"), success: true };
        } else {
          return { output: entries.join("  "), success: true };
        }
      }

      case "cd": {
        const target = cleanArgs[0] || "~";
        const dest = this.resolvePath(target);
        const node = this.getNode(dest);
        if (!node) {
          return { output: `bash: cd: ${target}: Bunday fayl yoki katalog yo'q`, success: false };
        }
        if (node.type !== "dir") {
          return { output: `bash: cd: ${target}: Bu katalog emas`, success: false };
        }
        this.currentPath = dest;
        return { output: "", success: true };
      }

      case "mkdir": {
        if (cleanArgs.length === 0) {
          return { output: "mkdir: operand yetishmayapti\nFoydalanish: mkdir <papka_nomi>", success: false };
        }
        const dirName = cleanArgs.find(a => !a.startsWith("-")) || cleanArgs[0];
        return this.createDirectory(dirName);
      }

      case "touch": {
        if (cleanArgs.length === 0) {
          return { output: "touch: fayl ko'rsatilmadi", success: false };
        }
        cleanArgs.forEach(fn => {
          if (!fn.startsWith("-")) this.createOrWriteFile(fn, "");
        });
        return { output: "", success: true };
      }

      case "cat": {
        if (cleanArgs.length === 0 && stdinData) {
          return { output: stdinData, success: true };
        }
        if (cleanArgs.length === 0) {
          return { output: "cat: operand yetishmayapti", success: false };
        }
        const target = cleanArgs[0];
        const node = this.getNode(target);
        if (!node) {
          return { output: `cat: ${target}: Bunday fayl yoki katalog yo'q`, success: false };
        }
        if (node.type === "dir") {
          return { output: `cat: ${target}: Bu katalog (fayl emas)`, success: false };
        }
        return { output: node.content || "", success: true };
      }

      case "head": {
        let n = 10;
        let file = "";
        for (let i = 0; i < cleanArgs.length; i++) {
          if (cleanArgs[i] === "-n" && cleanArgs[i + 1]) {
            n = parseInt(cleanArgs[i + 1], 10);
            i++;
          } else if (!cleanArgs[i].startsWith("-")) {
            file = cleanArgs[i];
          }
        }
        let text = stdinData;
        if (file) {
          const node = this.getNode(file);
          if (!node) return { output: `head: '${file}' o'qib bo'lmadi`, success: false };
          text = node.content;
        }
        const lines = (text || "").split("\n").slice(0, n).join("\n");
        return { output: lines, success: true };
      }

      case "tail": {
        let n = 10;
        let file = "";
        for (let i = 0; i < cleanArgs.length; i++) {
          if (cleanArgs[i] === "-n" && cleanArgs[i + 1]) {
            n = parseInt(cleanArgs[i + 1], 10);
            i++;
          } else if (!cleanArgs[i].startsWith("-")) {
            file = cleanArgs[i];
          }
        }
        let text = stdinData;
        if (file) {
          const node = this.getNode(file);
          if (!node) return { output: `tail: '${file}' o'qib bo'lmadi`, success: false };
          text = node.content;
        }
        const splitted = (text || "").split("\n").filter(Boolean);
        const lines = splitted.slice(Math.max(0, splitted.length - n)).join("\n");
        return { output: lines, success: true };
      }

      case "grep": {
        const isCaseInsensitive = cleanArgs.some(a => a.startsWith("-") && a.includes("i"));
        const nonFlags = cleanArgs.filter(a => !a.startsWith("-"));
        const pattern = nonFlags[0] || "";
        const file = nonFlags[1];

        let text = stdinData;
        if (file) {
          const node = this.getNode(file);
          if (!node) return { output: `grep: ${file}: Bunday fayl yoki katalog yo'q`, success: false };
          text = node.content;
        }

        if (!pattern) return { output: "", success: true };

        const lines = (text || "").split("\n");
        const matched = lines.filter(l => {
          if (isCaseInsensitive) {
            return l.toLowerCase().includes(pattern.toLowerCase());
          }
          return l.includes(pattern);
        });
        return { output: matched.join("\n"), success: true };
      }

      case "wc": {
        const countLines = cleanArgs.some(a => a.includes("l"));
        const file = cleanArgs.find(a => !a.startsWith("-"));
        let text = stdinData;
        if (file) {
          const node = this.getNode(file);
          if (!node) return { output: `wc: ${file}: Fayl yo'q`, success: false };
          text = node.content;
        }
        const linesCount = (text || "").split("\n").filter(Boolean).length;
        if (countLines) {
          return { output: `${linesCount} ${file || ""}`.trim(), success: true };
        }
        return { output: `${linesCount} 15 120 ${file || ""}`.trim(), success: true };
      }

      case "sort": {
        let text = stdinData;
        const file = cleanArgs.find(a => !a.startsWith("-"));
        if (file) {
          const node = this.getNode(file);
          if (!node) return { output: `sort: ${file}: Fayl yo'q`, success: false };
          text = node.content;
        }
        const sorted = (text || "").split("\n").filter(Boolean).sort().join("\n");
        return { output: sorted, success: true };
      }

      case "find": {
        const startPath = cleanArgs.find(a => !a.startsWith("-")) || ".";
        let pattern = "";
        const nameIdx = cleanArgs.indexOf("-name");
        if (nameIdx !== -1 && cleanArgs[nameIdx + 1]) {
          pattern = cleanArgs[nameIdx + 1].replace(/[*"]/g, "");
        }

        const baseNode = this.getNode(startPath);
        if (!baseNode) return { output: `find: '${startPath}': Fayl yo'q`, success: false };

        const results = [];
        const traverse = (node, curP) => {
          if (node.type === "file") {
            if (!pattern || node.name.includes(pattern)) results.push(curP);
          } else if (node.type === "dir" && node.children) {
            if (!pattern || node.name.includes(pattern)) results.push(curP);
            Object.keys(node.children).forEach(k => {
              traverse(node.children[k], `${curP}/${k}`);
            });
          }
        };
        traverse(baseNode, startPath);
        return { output: results.join("\n"), success: true };
      }

      case "chmod": {
        if (cleanArgs.length < 2) {
          return { output: "chmod: operand yetishmayapti\nFoydalanish: chmod <ruxsat> <fayl>", success: false };
        }
        const [mode, target] = cleanArgs;
        const node = this.getNode(target);
        if (!node) return { output: `chmod: '${target}' fayli yo'q`, success: false };

        if (mode === "+x" || mode === "755" || mode === "777") {
          node.permissions = "-rwxr-xr-x";
        } else if (mode === "600") {
          node.permissions = "-rw-------";
        } else if (mode === "644") {
          node.permissions = "-rw-r--r--";
        }
        return { output: "", success: true };
      }

      case "ps": {
        const lines = [
          "PID  USER     %CPU %MEM   TIME COMMAND",
          ...this.processes.map(p => 
            `${String(p.pid).padEnd(5)} ${p.user.padEnd(8)} ${String(p.cpu).padStart(4)} ${String(p.mem).padStart(4)} ${p.time.padStart(6)} ${p.cmd}`
          )
        ];
        return { output: lines.join("\n"), success: true };
      }

      case "kill": {
        const targetPid = parseInt(cleanArgs.find(a => !a.startsWith("-")), 10);
        if (!targetPid) return { output: "kill: PID ko'rsatilmadi", success: false };
        const idx = this.processes.findIndex(p => p.pid === targetPid);
        if (idx === -1) return { output: `bash: kill: (${targetPid}) - Bunday jarayon topilmadi`, success: false };
        this.processes.splice(idx, 1);
        return { output: `[1]+ Terminated process ${targetPid}`, success: true };
      }

      case "free": {
        return {
          output: "               total        used        free      shared  buff/cache   available\nMem:           15.3Gi       2.8Gi       8.4Gi       210Mi       4.1Gi      12.1Gi\nSwap:           8.0Gi          0B       8.0Gi",
          success: true
        };
      }

      case "df": {
        return {
          output: "Filesystem     1K-blocks      Used Available Use% Mounted on\n/dev/nvme0n1p2 479152436 112450320 342289456  25% /\ntmpfs            8012340         0   8012340   0% /dev/shm\n/dev/nvme0n1p1    523248      6144    517104   2% /boot/efi",
          success: true
        };
      }

      case "uptime":
        return { output: " 22:15:00 up 4 days,  2:18,  1 user,  load average: 0.12, 0.08, 0.05", success: true };

      case "tar": {
        // Simulyatsiya qilingan arxivlash
        if (cleanArgs.some(a => a.includes("c"))) {
          const archiveName = cleanArgs.find(a => a.endsWith(".tar") || a.endsWith(".tar.gz") || a.endsWith(".tgz")) || "backup.tar.gz";
          this.createOrWriteFile(archiveName, "ARCHIVE_DATA_STREAM");
          return { output: "", success: true };
        }
        return { output: "Arxiv muvaffaqiyatli qayta ishlandi", success: true };
      }

      case "ping": {
        const host = cleanArgs[0] || "8.8.8.8";
        return {
          output: `PING ${host} (${host}) 56(84) bytes of data.\n64 bytes from ${host}: icmp_seq=1 ttl=118 time=14.2 ms\n64 bytes from ${host}: icmp_seq=2 ttl=118 time=13.8 ms\n--- ${host} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`,
          success: true
        };
      }

      case "curl": {
        const url = cleanArgs[0] || "https://tuxedocomputers.com";
        return {
          output: `HTTP/2 200 OK\nserver: nginx\ndate: ${new Date().toUTCString()}\ncontent-type: text/html; charset=UTF-8\n\n<!DOCTYPE html><html><head><title>Tuxedo OS Welcome</title></head><body><h1>Welcome to Linux</h1></body></html>`,
          success: true
        };
      }

      case "cp": {
        if (cleanArgs.length < 2) {
          return { output: "cp: manba va manzil fayllar talab qilinadi\nFoydalanish: cp <manba> <manzil>", success: false };
        }
        const [src, dest] = cleanArgs;
        const srcNode = this.getNode(src);
        if (!srcNode) return { output: `cp: '${src}' topilmadi`, success: false };
        return this.createOrWriteFile(dest, srcNode.content || "");
      }

      case "mv": {
        if (cleanArgs.length < 2) return { output: "mv: manba va manzil talab qilinadi", success: false };
        const [src, dest] = cleanArgs;
        const srcNode = this.getNode(src);
        if (!srcNode) return { output: `mv: '${src}' topilmadi`, success: false };
        this.createOrWriteFile(dest, srcNode.content || "");
        this.deleteNode(src);
        return { output: "", success: true };
      }

      case "rm": {
        if (cleanArgs.length === 0) return { output: "rm: operand yetishmayapti", success: false };
        const target = cleanArgs.find(a => !a.startsWith("-")) || "";
        const isRec = cleanArgs.some(a => a.startsWith("-") && a.includes("r"));
        const node = this.getNode(target);
        if (!node) return { output: `rm: '${target}' topilmadi`, success: false };
        if (node.type === "dir" && !isRec) return { output: `rm: '${target}': Bu katalog (rm -r kerak)`, success: false };
        this.deleteNode(target);
        return { output: "", success: true };
      }

      case "history":
        return { output: "  1 pwd\n  2 ls -la\n  3 whoami\n  4 ps aux", success: true };

      case "help":
        return {
          output: "Tuxedo OS terminal buyruqlari: pwd, ls, cd, mkdir, touch, cat, cp, mv, rm, echo, whoami, date, clear, head, tail, grep, wc, sort, find, chmod, ps, kill, free, df, uptime, tar, ping, curl, env, export, uname\nBarcha 45 ta topshiriqni bajaring!",
          success: true
        };

      default:
        return {
          output: `bash: ${mainCmd}: buyruq topilmadi. Yordam uchun 'help' deb yozing yoki Maslahatdan foydalaning.`,
          success: false
        };
    }
  }

  createDirectory(pathStr) {
    const parentInfo = this.getParentNode(pathStr);
    if (!parentInfo || !parentInfo.parentNode || parentInfo.parentNode.type !== "dir") {
      return { output: `mkdir: '${pathStr}': Yuqori papka mavjud emas`, success: false };
    }
    const { parentNode, baseName } = parentInfo;
    if (parentNode.children[baseName]) {
      return { output: `mkdir: '${baseName}' katalogi allaqachon mavjud`, success: true };
    }
    parentNode.children[baseName] = {
      type: "dir",
      name: baseName,
      permissions: "drwxr-xr-x",
      children: {}
    };
    return { output: "", success: true };
  }

  createOrWriteFile(pathStr, content) {
    const parentInfo = this.getParentNode(pathStr);
    if (!parentInfo || !parentInfo.parentNode || parentInfo.parentNode.type !== "dir") {
      return { output: `touch/write: '${pathStr}': Yuqori papka topilmadi`, success: false };
    }
    const { parentNode, baseName } = parentInfo;
    parentNode.children[baseName] = {
      type: "file",
      name: baseName,
      permissions: "-rw-r--r--",
      content: content
    };
    return { output: "", success: true };
  }

  appendToFile(pathStr, extraContent) {
    const node = this.getNode(pathStr);
    if (node && node.type === "file") {
      node.content = (node.content || "") + extraContent;
      return { output: "", success: true };
    }
    return this.createOrWriteFile(pathStr, extraContent);
  }

  deleteNode(pathStr) {
    const parentInfo = this.getParentNode(pathStr);
    if (!parentInfo || !parentInfo.parentNode) return false;
    const { parentNode, baseName } = parentInfo;
    if (parentNode.children && parentNode.children[baseName]) {
      delete parentNode.children[baseName];
      return true;
    }
    return false;
  }
}
