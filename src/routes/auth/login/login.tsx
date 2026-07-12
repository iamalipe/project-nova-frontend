import api from "@/api/api"
import { AsyncButton } from "@/components/custom/async-button"
import FormController from "@/components/form/form-controller"
import ThemeToggle from "@/components/theme-toggle/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { currentUserQueryKey } from "@/hooks/api-query/auth-query"
import { queryClient } from "@/hooks/use-api-query"
import { handleFormError } from "@/lib/form"
import { cn, isSafeRedirectPath } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import { PawPrintIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export type FormSchemaType = z.infer<typeof formSchema>

const Login = () => {
  const navigate = useNavigate()
  const { redirect } = useSearch({
    from: "/_auth/login",
  })

  const defaultValues: Partial<FormSchemaType> = {
    email: "",
    password: "",
  }

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
    // mode: "onChange",
  })

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const res = await api.auth.login(data)
      if (!res.success) {
        handleFormError({
          form,
          error: res,
          defaultMessage: "Login failed, please try again.",
        })
        return
      }
      form.reset()
      // await apiQuery.auth.getCurrentUser();
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
      // Only ever navigate to a same-origin relative path from `redirect` —
      // it's a user-controlled query param, so anything else is rejected to
      // avoid an open redirect.
      navigate({ to: isSafeRedirectPath(redirect) ? redirect : "/app" })
    } catch (error) {
      handleFormError({
        form,
        error,
        defaultMessage: "Login failed, please try again.",
      })
    }
  }

  return (
    <main className="h-full-x overflow-hidden flex">
      {/* Left side */}
      <div className="flex-1 relative hidden md:flex flex-col justify-between">
        <div className="pl-5 pr-8 py-4 flex gap-4 items-center">
          <PawPrintIcon className="w-8 h-8" />
          <a href="#" className="text-2xl font-bold">
            React Template
          </a>
        </div>
        <div className="md:px-8 md:py-4 px-4 py-2 md:flex relative hidden">
          <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm z-[-1]"></div>
          <p className="text-white text-xs md:text-base">
            “This library has saved me countless hours of work and helped me
            deliver stunning designs to my clients faster than ever before.” -
            Abhiseck
          </p>
        </div>
        <img
          src="/auth-bg.jpg"
          alt="Just an"
          className="absolute dark:hidden -z-10 top-0 left-0 w-full h-full object-cover"
        />
        <img
          src="/auth-bg-dark.png"
          alt="Just an"
          className="absolute dark:block hidden -z-10 top-0 left-0 w-full h-full object-cover"
        />
      </div>
      {/* Right side */}
      <div className="flex-1 flex bg-background flex-col">
        <div className="flex md:hidden gap-2 justify-between px-2 py-2 items-center">
          <div className="pl-2 pr-2 py-2 flex gap-2 items-center">
            <PawPrintIcon className="w-6 h-6" />
            <Link to="/" className="text-lg font-bold">
              React Template
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="outline" nativeButton={false} render={<Link to="/register" />}>
              Register
            </Button>
            <ThemeToggle />
          </div>
        </div>
        <div className="hidden md:flex gap-4 justify-between px-4 py-4">
          <ThemeToggle />
          <Button variant="outline" nativeButton={false} render={<Link to="/register" search={{ redirect }} />}>
            Register
          </Button>
        </div>
        <div className="flex flex-col md:max-w-xs max-w-sm justify-center mx-auto flex-1 max-md:p-6 max-md:rounded-md">
          <div className="flex flex-col text-center">
            <span className="text-xl font-bold">Welcome to React Template</span>
            <p className="text-sm text-muted-foreground">
              Enter your details below to login
            </p>
          </div>
          {/* Login form */}
          <form
            className="grid grid-cols-1 gap-4 mt-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormController
              form={form}
              name="email"
              label="Email"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  value={field.value}
                  type="email"
                  name="email"
                  placeholder="John@example.com"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="password"
              label="Password"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  value={field.value}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            {form.formState.errors.root && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.root.message}
              </p>
            )}
            <div>
              <AsyncButton
                loading={form.formState.isSubmitting}
                className="w-full"
                type="submit"
                loadingText="Logging in..."
              >
                Login
              </AsyncButton>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 px-2 bg-background">Or</span>
            </div>
            <div className="grid gap-2 grid-cols-2">
              <Button type="button" variant="outline" className="w-full">
                Github
              </Button>
              <Button type="button" variant="outline" className="w-full">
                Google
              </Button>
              <Button type="button" variant="outline" className="w-full">
                Passkey
              </Button>
              <Button type="button" variant="outline" className="w-full">
                Magic Link
              </Button>
            </div>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login
