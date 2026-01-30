import Image from "next/image";
import { Home, User, Settings, Mail, Heart, Star, ArrowRight, ExternalLink } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Welcome to GraceSoft
            </h1>
          </div>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Here are some example Lucide icons you can use in your project. Check out the{" "}
            <a
              href="https://lucide.dev/icons"
              className="font-medium text-zinc-950 dark:text-zinc-50 inline-flex items-center gap-1"
            >
              Lucide icon library <ExternalLink className="w-4 h-4" />
            </a>{" "}
            for more icons.
          </p>
          
          {/* Icon Examples */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <User className="w-6 h-6 text-green-600" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">User</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Settings</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <Mail className="w-6 h-6 text-red-600" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Mail</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <Heart className="w-6 h-6 text-pink-600" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Heart</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Star className="w-4 h-4" />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  );
}
