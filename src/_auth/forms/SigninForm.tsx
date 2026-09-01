import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { SigninValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import Loader from "@/components/shared/Loader";

const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, loginAsDemoUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Please check your credentials or use Instant Demo Login.",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        variant: "destructive",
        title: "Authentication error",
        description: "Could not log into user account.",
      });
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-[32px] glass-card border border-white/10 shadow-2xl relative">
      {/* Decorative Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500 via-secondary-500 to-accent-cyan flex-center shadow-glow mb-4">
          <span className="text-3xl">🐱</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back to <span className="gradient-text">MeowBox</span>
        </h2>
        <p className="text-sm text-light-3 mt-1.5">
          Enter your credentials or test with instant demo mode
        </p>
      </div>

      {/* 1-Click Instant Demo Login Banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-primary-500/15 via-secondary-500/15 to-transparent border border-primary-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-primary-500 shrink-0" />
          <div className="text-left">
            <p className="text-xs font-bold text-white">Instant Preview Mode</p>
            <p className="text-[11px] text-light-3">No registration needed</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={loginAsDemoUser}
          className="h-8 px-3 text-xs bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl shadow-glow font-semibold"
        >
          1-Click Login
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-light-4" />
                    <Input
                      type="email"
                      placeholder="catlover@example.com"
                      className="shad-input pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-light-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="shad-input pl-10 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-light-4 hover:text-light-2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSigningIn || isUserLoading}
            className="w-full mt-2 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-glow"
          >
            {isSigningIn || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-xs text-light-3 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary-500 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SigninForm;
