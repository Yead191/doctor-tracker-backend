"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HeartPulse, Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { loginUser } from "@/helpers/next-fetch/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@doctortracker.com",
      password: "Admin@123456",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await loginUser(values);

      if (res.success) {
        toast.success("Welcome back! Authentication successful.");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(
          typeof res.error === "string"
            ? res.error
            : res.message || "Invalid credentials. Please try again."
        );
      }
    } catch {
      toast.error("Network error. Please ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCredentials = () => {
    setValue("email", "admin@doctortracker.com");
    setValue("password", "Admin@123456");
    toast.info("Demo credentials applied");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30 shadow-lg shadow-teal-950/50 mb-4">
            <HeartPulse className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Doctor Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Administrative Portal Sign In
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="admin@doctortracker.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2 font-semibold bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-900/40"
            >
              Sign In to Portal
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Credentials pill */}
          <div className="mt-6 pt-5 border-t border-slate-700/80 text-center">
            <button
              type="button"
              onClick={handleDemoCredentials}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              Fill Demo Credentials (Admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

