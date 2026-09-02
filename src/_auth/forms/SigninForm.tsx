import Loader from "@/components/shared/Loader";
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
    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        return toast({
          variant: "destructive",
          title: "Sign in failed",
          description: "Invalid email or password. Please try again or use 1-Click Demo.",
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
          description: "Could not log in. Please try again.",
        });
      }
    } catch (error: any) {
      return toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error?.message || "Invalid credentials. Please check your email and password.",
      });
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      {/* Main Login Box */}
      <div className="p-8 sm:p-10 rounded-2xl bg-dark-1 border border-dark-4 shadow-2xl flex flex-col items-center">
        {/* Instagram Brand Wordmark */}
        <div className="flex flex-col items-center text-center mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-white font-inter">
            MeowBox
          </h1>
          <p className="text-xs text-light-4 mt-1">
            Sign in to see photos and videos from friends
          </p>
        </div>

        {/* 1-Click Instant Demo Login Banner */}
        <div className="w-full mb-5 p-3 rounded-xl bg-dark-2 border border-dark-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500 shrink-0" />
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-white">Instant Demo</p>
              <p className="text-[10px] text-light-4">No login needed</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={loginAsDemoUser}
            className="h-7 px-3 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold"
          >
            1-Click Login
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email or username"
                      className="shad-input"
                      {...field}
                    />
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
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="shad-input pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-light-4 hover:text-light-2"
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
              className="w-full mt-2 h-10 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all"
            >
              {isSigningIn || isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader size="sm" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Switch to Sign Up Box */}
      <div className="p-5 rounded-2xl bg-dark-1 border border-dark-4 text-center">
        <p className="text-xs text-light-2">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-primary-500 font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
