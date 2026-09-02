import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, loginAsDemoUser } = useUserContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();

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
    try {
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
          title: "Account created! ✨",
          description: "Please log in with your new email and password.",
        });
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        navigate("/sign-in");
      }
    } catch (error: any) {
      let description = "Please check your details and try again.";
      if (error?.code === 409 || error?.message?.includes("already exists")) {
        description = "An account with this email already exists. Please log in instead.";
      } else if (error?.message) {
        description = error.message;
      }
      return toast({
        variant: "destructive",
        title: "Registration failed",
        description,
      });
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      {/* Main Sign Up Box */}
      <div className="p-8 sm:p-10 rounded-2xl bg-dark-1 border border-dark-4 shadow-2xl flex flex-col items-center">
        {/* Instagram Brand Wordmark */}
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white font-inter">
            MeowBox
          </h1>
          <p className="text-xs text-light-4 mt-1 font-semibold">
            Sign up to see photos and videos from your friends.
          </p>
        </div>

        {/* 1-Click Instant Demo Login Banner */}
        <div className="w-full mb-5 p-3 rounded-xl bg-dark-2 border border-dark-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500 shrink-0" />
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-white">Instant Demo</p>
              <p className="text-[10px] text-light-4">Skip registration</p>
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

        <div className="flex items-center gap-3 w-full mb-4">
          <hr className="flex-1 border-dark-4" />
          <span className="text-[11px] uppercase font-semibold text-light-4">OR</span>
          <hr className="flex-1 border-dark-4" />
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
                      placeholder="Mobile Number or Email"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Username"
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

            <p className="text-[10px] text-light-4 text-center leading-relaxed mt-1">
              By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
            </p>

            <Button
              type="submit"
              disabled={isCreatingAccount}
              className="w-full mt-2 h-10 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl"
            >
              {isCreatingAccount ? (
                <div className="flex-center gap-2">
                  <Loader size="sm" />
                  <span>Signing up...</span>
                </div>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Switch to Sign In Box */}
      <div className="p-5 rounded-2xl bg-dark-1 border border-dark-4 text-center">
        <p className="text-xs text-light-2">
          Have an account?{" "}
          <Link to="/sign-in" className="text-primary-500 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
