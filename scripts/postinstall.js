import { execSync } from 'child_process'

if (!process.env.SKIP_POSTINSTALL) {
  execSync('node scripts/copy-dependencies.js && pnpm gen', { stdio: 'inherit' })
}
