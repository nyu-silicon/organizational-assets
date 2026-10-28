// Usage: npm run add-member -w backend -- <email> "<name>"
import fs from "node:fs";
import readline from "node:readline";
import { hashPassword, loadMembers, membersFile } from "../src/auth.js";

const [email, name] = process.argv.slice(2);
if (!email || !name) {
  console.error('usage: npm run add-member -w backend -- <email> "<name>"');
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// Hide the password as it's typed.
rl._writeToOutput = (s) => rl.output.write(s.startsWith("password") ? s : "");
rl.question("password: ", (password) => {
  rl.close();
  console.log();
  if (password.length < 8) {
    console.error("password must be at least 8 characters");
    process.exit(1);
  }

  const members = loadMembers().filter((m) => m.email !== email.toLowerCase());
  members.push({
    email: email.toLowerCase(),
    name,
    joined: new Date().toISOString().slice(0, 10),
    password: hashPassword(password),
  });
  fs.writeFileSync(membersFile, JSON.stringify(members, null, 2) + "\n");
  console.log(`saved ${email}`);
});
