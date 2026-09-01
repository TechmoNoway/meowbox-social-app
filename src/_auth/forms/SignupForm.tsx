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
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { SignupValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import Loader from "@/components/shared/Loader";

const SignUpForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, loginAsDemoUser } = useUserContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please check your inputs and try again.",
      });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Please try logging in directly.",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        variant: "destructive",
        title: "Authentication failed",
      });
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-[32px] glass-card border border-white/10 shadow-2xl relative">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500 via-secondary-500 to-accent-cyan flex-center shadow-glow mb-4">
          <span className="text-3xl">🐾</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Join <span className="gradient-text">MeowBox</span>
        </h2>
        <p className="text-sm text-light-3 mt-1.5">
          Create an account to share moments with feline lovers
        </p>
      </div>

      {/* 1-Click Demo Login Banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-primary-500/15 via-secondary-500/15 to-transparent border border-primary-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-primary-500 shrink-0" />
          <div className="text-left">
            <p className="text-xs font-bold text-white">Instant Demo</p>
            <p className="text-[11px] text-light-3">Skip sign up & explore</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={loginAsDemoUser}
          className="h-8 px-3 text-xs bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl shadow-glow font-semibold"
        >
          Demo Mode
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-light-4" />
                    <Input
                      placeholder="Milo The Cat"
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-3.5 w-4 h-4 text-light-4" />
                    <Input
                      placeholder="milopaws"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-light-4" />
                    <Input
                      type="email"
                      placeholder="milo@example.com"
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
            disabled={isCreatingAccount || isSigningIn}
            className="w-full mt-3 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-glow"
          >
            {isCreatingAccount || isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader />
                <span>Creating account...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-xs text-light-3 text-center mt-3">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary-500 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
