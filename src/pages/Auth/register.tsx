import { Button } from "@/components/ui/button";
import googleIcon from "@/assets/img/Logo-google-icon-PNG.png";
import { useAuth } from "@/context";
import PageTitle from "@/components/PageTitle";
import { ChangeEvent, FormEvent, useState } from "react";
import { RegisterFormData } from "@/types/register";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { ErrorResponseI } from "@/types/context";
import { useGoogleLogin } from "@react-oauth/google";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function Register() {
  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpValue, setOtpValue] = useState<string | void>("");
  const [storedOTP, setStoredOTP] = useState<string | void>("");
  // const backendUrl = import.meta.env.VITE_API_URL;

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsPending(true);
    e.preventDefault();

    try {
      const payload: RegisterFormData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        otp: storedOTP as string,
      };

      register(payload);
      toast({
        title: "Registered successfully",
        variant: "success",
      });

      navigate("/problems");
    } catch (error: unknown) {
      const apiError = error as AxiosError<ErrorResponseI>;
      if (apiError.response?.status === 500) {
        console.error("Server error", apiError.response.data);
        toast({
          title: "Server Error try again",
          variant: "destructive",
        });
      } else {
        const validationErrors = apiError.response?.data?.errors;

        if (validationErrors && typeof validationErrors === "object") {
          Object.entries(validationErrors).forEach(([, errors]) => {
            if (Array.isArray(errors)) {
              errors.forEach((errorMessage) => {
                toast({
                  title: `${errorMessage}`,
                  variant: "destructive",
                });
              });
            }
          });
        } else {
          toast({
            title: apiError.response?.data?.message || "Something went wrong",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsPending(false);
    }
  };

  const emailVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload: { email: string } = {
        email: formData.email,
      };
      const response = await verifyOTP(payload);
      setStoredOTP(response);
      toast({
        title: "OTP sent to email",
        variant: "success",
      });

      setEmailVerified(true);
    } catch (error: unknown) {
      const apiError = error as AxiosError<ErrorResponseI>;
      const validationErrors = apiError.response?.data?.errors;

      if (validationErrors && typeof validationErrors === "object") {
        Object.entries(validationErrors).forEach(([, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach((errorMessage) => {
              toast({
                title: `${errorMessage}`,
                variant: "destructive",
              });
            });
          }
        });
      } else {
        toast({
          title: apiError.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <PageTitle title="Register Now" />
      <div className="max-w-lg border border-gray-300 w-full mx-auto mt-8 rounded-xl max-sm:border-0">
        <div className="px-8 py-8 flex flex-col gap-8 max-sm:px-4">
          <p className="text-center text-xl font-bold tracking-tight">
            Fly into FlagForge Where Challenges Take Wings!🪽
          </p>
          <form
            className="flex flex-col gap-3"
            onSubmit={emailVerified ? handleSubmit : emailVerify}
            method="post"
          >
            <div className="flex gap-3 w-full">
              <label htmlFor="firstName" className="flex flex-col gap-1 w-full">
                <p className="font-medium text-sm">First Name</p>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  onChange={handleChange}
                  value={formData.firstName}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus-within:ring-0 focus-within:outline-offset-4 focus-within:outline-primary"
                  required
                />
              </label>
              <label htmlFor="lastName" className="flex flex-col gap-1 w-full">
                <p className="font-medium text-sm">Last Name</p>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  onChange={handleChange}
                  value={formData.lastName}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus-within:ring-0 focus-within:outline-offset-4 focus-within:outline-primary"
                  required
                />
              </label>
            </div>
            <label htmlFor="email" className="flex flex-col gap-1">
              <p className="font-medium text-sm">Email address</p>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                value={formData.email}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus-within:ring-0 focus-within:outline-offset-4 focus-within:outline-primary"
                required
              />
            </label>

            {emailVerified ? (
              <>
                <div className="flex flex-col gap-4">
                  <label htmlFor="password" className="flex flex-col gap-1">
                    <p className="font-medium text-sm">Verify OTP</p>
                    <InputOTP
                      maxLength={6}
                      value={otpValue as string}
                      onChange={(value) => setOtpValue(value)}
                      pattern={REGEXP_ONLY_DIGITS}
                      required
                    >
                      <InputOTPGroup className="w-full">
                        <InputOTPSlot index={0} className="w-full" />
                        <InputOTPSlot index={1} className="w-full" />
                        <InputOTPSlot index={2} className="w-full" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="w-full">
                        <InputOTPSlot index={3} className="w-full" />
                        <InputOTPSlot index={4} className="w-full" />
                        <InputOTPSlot index={5} className="w-full" />
                      </InputOTPGroup>
                    </InputOTP>
                  </label>
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="password" className="flex flex-col gap-1">
                    <p className="font-medium text-sm">Password</p>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onChange={handleChange}
                      value={formData.password}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus-within:ring-0 focus-within:outline-offset-4 focus-within:outline-primary"
                      required
                    />
                  </label>
                </div>
              </>
            ) : (
              ""
            )}
            <Button className="font-bold" disabled={isPending}>
              {emailVerified
                ? isPending
                  ? "Registering..."
                  : "Register Now"
                : isPending
                ? "Verifying"
                : "Verify email Now"}
            </Button>
          </form>
          <div className="flex items-center w-full gap-4">
            <hr className="w-full" />
            <p className="text-sm text-gray-400 text-nowrap">
              Or Continue with
            </p>
            <hr className="w-full" />
          </div>

          <div>
            {/* <GoogleLogin
              onSuccess={(creadentialResponse) => {
                console.log(creadentialResponse);
              }}
              onError={() => {
                console.log("Registration Failed");
              }}
            /> */}
            <Button
              variant={"outline"}
              className="w-full"
              onClick={() => handleGoogleLogin()}
            >
              <img src={googleIcon} alt="Google icon" className="w-4" />
              <p>Continue with Google</p>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
