import { useActionState } from "react";
import type React from "react";
import type { StateLoginAccount } from "@/utils/interface";
import "./login-form.styles.scss";

export const LoginForm: React.FC = () => {
  async function loginAccountEvent(
    prevState: StateLoginAccount,
    formData: FormData,
  ): Promise<StateLoginAccount> {
    const email = formData.get("email") as string;

    try {
      return {
        success: true,
        data: { email },
        error: "",
        fieldErrors: null,
      };
    } catch (err) {
      return {
        ...prevState,
        success: false,
        error: "Qualcosa è andato storto con il login.",
      };
    }
  }

  const [state, formAction, isPending] = useActionState(
    async (prevState: StateLoginAccount, formData: FormData) =>
      await loginAccountEvent(prevState, formData),
    {
      success: false,
      data: null,
      error: "",
      fieldErrors: null,
    },
  );

  return (
    <form action={formAction} className="rootLoginForm">
      <fieldset disabled={isPending}>
        <div className="boxInput">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" />
        </div>
      </fieldset>
    </form>
  );
};
