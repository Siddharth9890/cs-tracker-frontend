import { useState } from "react";
import Link from "next/link";
import Image from "../../components/Images";
import { useRouter } from "next/router";

import store2 from "store2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CheckingAccount from "../../components/utils/CheckingAccount";
import logo from "../../public/logo.png";
import axios from "../../api";
import { userType } from "../../customTypes";
import useUser from "../../hooks/useUser";

import HCaptcha from "@hcaptcha/react-hcaptcha";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

toast.configure();

function Login() {
  const [user, signIn] = useUser();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setSubmitButtonDisabled(true);
    try {
      const { data } = await axios.post(
        "auth/login",
        JSON.stringify({ email })
      );
      const accessToken = data.body.accessToken;

      const finalUser: userType = {
        ...data.body.user,
        accessToken,
      };
      signIn(finalUser);
      store2.session("account", "login-done");
      if (finalUser.multi_factor_enabled) {
        router.push("/verify-mfa");
      } else {
        router.push("/verify");
      }
    } catch (error: any) {
      let message = "Something went wrong!";
      if (error?.response?.data?.body?.email?._errors) {
        const e = error?.response?.data?.body?.email?._errors;
        message = e[0];
      }
      toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
      });
    }
    setSubmitButtonDisabled(false);
  };

  function SubmitButton() {
    if (
      email &&
      email.includes("@") &&
      email.includes(".com") &&
      token.length > 0
    ) {
      return (
        <button
          type="submit"
          onClick={(e) => submit(e)}
          disabled={submitButtonDisabled}
          className={classNames(
            submitButtonDisabled
              ? "w-full cursor-not-allowed flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
              : "w-full  flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          Log in
        </button>
      );
    } else {
      return (
        <button
          type="submit"
          className="w-full cursor-not-allowed flex justify-center py-2 px-4  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Log in
        </button>
      );
    }
  }

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Image src={logo} alt="Workflow" height={40} width={43} />
          </div>
          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
            Welcome back! ✨
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@example.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA!}
                onVerify={(token, ekey) => setToken(token)}
              />
              <SubmitButton />
            </div>
            <div className="mt-2 text-center text-lg text-gray-600">
              Or Create a new account{" "}
              <div className="font-medium text-indigo-600 hover:text-indigo-500">
                <Link href={"/register"}>Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
