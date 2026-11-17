// Virtual File System (VFS) va Bash Simulator Interpretatori

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
          children: {
            "README.txt": {
              type: "file",
              name: "README.txt",
              content: "Linux Terminal Trainer-ga xush kelibsiz! Har bir topshiriqni diqqat bilan o'qing va bajaring.\n",
            },
            ".bashrc": {
              type: "file",
              name: ".bashrc",
              content: "# Antigravity Bash Profile Configuration\nexport PS1='user@linux-trainer:\\w\\$ '\n",
            },
            "hujjatlar": {
              type: "dir",
              name: "hujjatlar",
              children: {
                "darslik.md": {
                  type: "file",
                  name: "darslik.md",
                  content: "# Linux Asoslari\n1. Navigatsiya\n2. Fayllarni boshqarish\n",
                }
              }
            }
          }
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
  }

  // To JSON for localStorage
  toJSON() {
    return {
      root: this.root,
      currentPath: this.currentPath,
    };
  }

  // Path resolution
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

  // Display path with ~ replacement
  getDisplayPath() {
    if (this.currentPath === "/home/user") return "~";
    if (this.currentPath.startsWith("/home/user/")) {
      return "~" + this.currentPath.slice("/home/user".length);
    }
    return this.currentPath;
  }

  execute(rawCommand) {
    const trimmed = rawCommand.trim();
    if (!trimmed) return { output: "", success: true, command: "" };

    // Handle redirection (e.g., echo "text" > file.txt)
    if (trimmed.includes(">")) {
      const parts = trimmed.split(">");
      const left = parts[0].trim();
      const right = parts[1].trim();
      if (left.startsWith("echo")) {
        let text = left.slice(4).trim();
        if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
          text = text.slice(1, -1);
        }
        const writeRes = this.createOrWriteFile(right, text + "\n");
        return writeRes;
      }
    }

    const args = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
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
        return { output: "user", success: true };

      case "date":
        return { output: new Date().toLocaleString("uz-UZ", { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', timeZoneName: 'short' }), success: true };

      case "clear":
        return { output: "", clear: true, success: true };

      case "echo":
        return { output: cleanArgs.join(" "), success: true };

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
            if (name === "." || name === "..") {
              isDir = true;
            } else {
              isDir = node.children[name]?.type === "dir";
              size = isDir ? 4096 : (node.children[name]?.content?.length || 0);
            }
            const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
            const dateStr = "Nov 17 10:30";
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
        const dirName = cleanArgs[0];
        const res = this.createDirectory(dirName);
        return res;
      }

      case "touch": {
        if (cleanArgs.length === 0) {
          return { output: "touch: fayl ko'rsatilmadi\nFoydalanish: touch <fayl_nomi>", success: false };
        }
        const fileName = cleanArgs[0];
        return this.createOrWriteFile(fileName, "");
      }

      case "cat": {
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
        return { output: node.content, success: true };
      }

      case "cp": {
        if (cleanArgs.length < 2) {
          return { output: "cp: manba va manzil fayllar talab qilinadi\nFoydalanish: cp <manba> <manzil>", success: false };
        }
        const [src, dest] = cleanArgs;
        const srcNode = this.getNode(src);
        if (!srcNode) {
          return { output: `cp: '${src}' ni tekshirib bo'lmadi: Bunday fayl yo'q`, success: false };
        }
        if (srcNode.type === "dir") {
          return { output: `cp: -r ko'rsatilmagan; '${src}' katalogini o'tkazib yuborildi`, success: false };
        }
        return this.createOrWriteFile(dest, srcNode.content);
      }

      case "mv": {
        if (cleanArgs.length < 2) {
          return { output: "mv: manba va manzil talab qilinadi\nFoydalanish: mv <eski> <yangi>", success: false };
        }
        const [src, dest] = cleanArgs;
        const srcNode = this.getNode(src);
        if (!srcNode) {
          return { output: `mv: '${src}' topilmadi: Bunday fayl yoki katalog yo'q`, success: false };
        }
        // Copy to dest
        this.createOrWriteFile(dest, srcNode.content);
        // Remove src
        this.deleteNode(src);
        return { output: "", success: true };
      }

      case "rm": {
        if (cleanArgs.length === 0) {
          return { output: "rm: operand yetishmayapti", success: false };
        }
        const target = cleanArgs.find(a => !a.startsWith("-")) || "";
        const isRec = cleanArgs.some(a => a.startsWith("-") && a.includes("r"));
        const node = this.getNode(target);
        if (!node) {
          return { output: `rm: '${target}' ni o'chirib bo'lmadi: Bunday fayl yoki katalog yo'q`, success: false };
        }
        if (node.type === "dir" && !isRec) {
          return { output: `rm: '${target}' ni o'chirib bo'lmadi: Bu katalog (kataloglar uchun 'rm -r' kerak)`, success: false };
        }
        this.deleteNode(target);
        return { output: "", success: true };
      }

      case "help":
        return {
          output: "Qo'llab-quvvatlanadigan buyruqlar: pwd, ls, cd, mkdir, touch, cat, cp, mv, rm, echo, whoami, date, clear, help\nO'qitish panelidagi vazifalarni bajaring!",
          success: true
        };

      default:
        return {
          output: `bash: ${mainCmd}: buyruq topilmadi. Yordam uchun 'help' deb yozing yoki Maslahat tugmasidan foydalaning.`,
          success: false
        };
    }
  }

  createDirectory(pathStr) {
    const parentInfo = this.getParentNode(pathStr);
    if (!parentInfo || !parentInfo.parentNode || parentInfo.parentNode.type !== "dir") {
      return { output: `mkdir: '${pathStr}' katalogini yaratib bo'lmadi: Yuqori papka mavjud emas`, success: false };
    }
    const { parentNode, baseName } = parentInfo;
    if (parentNode.children[baseName]) {
      return { output: `mkdir: '${baseName}' katalogi allaqachon mavjud`, success: true };
    }
    parentNode.children[baseName] = {
      type: "dir",
      name: baseName,
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
      content: content
    };
    return { output: "", success: true };
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
