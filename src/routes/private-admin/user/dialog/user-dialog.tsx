import type { UserRole, UserType } from "@/api/user-api"
import { AsyncButton } from "@/components/custom/async-button"
import FormController from "@/components/form/form-controller"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import apiQuery from "@/hooks/use-api-query"
import useQueryLoadingState from "@/hooks/use-query-loading-state"
import { handleFormError } from "@/lib/form"
import { cn } from "@/lib/utils"
import type { DialogStateType } from "@/routes/private-admin/private-admin-route"
import { faker } from "@faker-js/faker"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { DicesIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import DialogSkeleton from "./dialog-skeleton"
import DialogViewMode from "./dialog-view-mode"

const rolesList: { value: UserRole; label: string }[] = [
  { value: "GUEST", label: "GUEST" },
  { value: "SUPERUSER", label: "SUPERUSER" },
  { value: "STORE_MANAGER", label: "STORE MANAGER" },
  { value: "STAFF", label: "STAFF" },
  { value: "CUSTOMER", label: "CUSTOMER" },
]

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional().or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["GUEST", "SUPERUSER", "STORE_MANAGER", "STAFF", "CUSTOMER"]),
  salary: z.coerce
    .number()
    .min(0, "Salary must be non-negative")
    .optional()
    .or(z.literal("")),
  countryId: z.string().optional().or(z.literal("")),
  stateId: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  zip: z.string().optional().or(z.literal("")),
  profileImage: z
    .string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal("")),
})

type FormSchemaType = z.infer<typeof formSchema>

export type UserDialogProps = {
  state: DialogStateType
  data?: UserType
}

const UserDialog = ({ state }: UserDialogProps) => {
  const userQuery = state.id ? apiQuery.user.useGet(state.id) : undefined
  const countriesQuery = apiQuery.country.useGetAll({ page: 0 })
  const statesQuery = apiQuery.state.useGetAll({ page: 0 })

  const { isLoading } = useQueryLoadingState(
    userQuery
      ? [userQuery, countriesQuery, statesQuery]
      : [countriesQuery, statesQuery]
  )

  if (isLoading) return <DialogSkeleton />

  const userData = userQuery?.data?.data
  const countries = countriesQuery.data?.data || []
  const states = statesQuery.data?.data || []

  if (state.mode === "VIEW") {
    return <DialogViewMode state={state} data={userData} />
  }

  return (
    <DialogMain
      state={state}
      data={userData}
      countries={countries}
      states={states}
    />
  )
}

export default UserDialog

type DialogMainProps = UserDialogProps & {
  countries: { id: string; name: string; flag: string }[]
  states: { id: string; name: string; countryId: string }[]
}

const DialogMain = ({ data, state, countries, states }: DialogMainProps) => {
  const navigate = useNavigate()
  const [selectedCountryId, setSelectedCountryId] = useState<string>("")

  const defaultValues: FormSchemaType = {
    email: data?.email ?? "",
    firstName: data?.firstName ?? "",
    lastName: data?.lastName ?? "",
    password: "",
    role: data?.role ?? "GUEST",
    salary: data?.salary ?? "",
    countryId: data?.countryId ?? "",
    stateId: data?.stateId ?? "",
    address: data?.address ?? "",
    zip: data?.zip ?? "",
    profileImage: data?.profileImage ?? "",
  }

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues: defaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    if (data?.countryId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCountryId(data.countryId)
    }
  }, [data])

  const filteredStates = useMemo(() => {
    if (!selectedCountryId) return []
    return states.filter((s) => s.countryId === selectedCountryId)
  }, [states, selectedCountryId])

  const onCountryChange = (cId: string) => {
    setSelectedCountryId(cId)
    form.setValue("countryId", cId, { shouldValidate: true })
    form.setValue("stateId", "", { shouldValidate: true })
  }

  const generateFakeData = () => {
    const randomRole =
      rolesList[Math.floor(Math.random() * rolesList.length)].value
    const randomCountry =
      countries.length > 0
        ? countries[Math.floor(Math.random() * countries.length)]
        : null
    const countryStates = randomCountry
      ? states.filter((s) => s.countryId === randomCountry.id)
      : []
    const randomState =
      countryStates.length > 0
        ? countryStates[Math.floor(Math.random() * countryStates.length)]
        : null

    if (randomCountry) {
      setSelectedCountryId(randomCountry.id)
    }

    form.reset({
      email: faker.internet.email().toLowerCase(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: "Password123!",
      role: randomRole,
      salary: Number(faker.finance.amount({ min: 30000, max: 150000, dec: 2 })),
      countryId: randomCountry?.id || "",
      stateId: randomState?.id || "",
      address: faker.location.streetAddress(),
      zip: faker.location.zipCode(),
      profileImage: faker.image.avatar(),
    })
  }

  const onClose = () => {
    form.reset()
    navigate({
      to: "/app/user",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const payload: any = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName || undefined,
        password: values.password || undefined,
        role: values.role,
        salary: values.salary !== "" ? Number(values.salary) : undefined,
        countryId: values.countryId || undefined,
        stateId: values.stateId || undefined,
        address: values.address || undefined,
        zip: values.zip || undefined,
        profileImage: values.profileImage || undefined,
      }

      const res = await apiQuery.user.create(payload)
      if (!res.success)
        throw new Error("Something went wrong, please try again.")
      toast.success("User created successfully.")
      onClose()
    } catch (err: any) {
      handleFormError({ form, error: err })
    }
  }

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) throw new Error("No id found")
      const payload: any = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName || undefined,
        password: values.password ? values.password : undefined,
        role: values.role,
        salary: values.salary !== "" ? Number(values.salary) : undefined,
        countryId: values.countryId || undefined,
        stateId: values.stateId || undefined,
        address: values.address || undefined,
        zip: values.zip || undefined,
        profileImage: values.profileImage || undefined,
      }

      const res = await apiQuery.user.update({
        id: state.id,
        data: payload,
      })
      if (!res.success)
        throw new Error("Something went wrong, please try again.")

      toast.success("User updated successfully.")
      onClose()
    } catch (err: any) {
      handleFormError({ form, error: err })
    }
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-h-[85vh] sm:max-w-[600px]">
        <DialogHeader className="mb-2">
          <DialogTitle>
            {state.mode === "CREATE" ? "Create User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {state.mode === "CREATE"
              ? "Create a new user account with role permissions and details."
              : "Update existing user details, password, and permissions."}
          </DialogDescription>
        </DialogHeader>
        {state.mode === "CREATE" && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateFakeData}
            >
              <DicesIcon className="mr-2 h-4 w-4" />
              Fake Data
            </Button>
          </div>
        )}
        <div className="grid max-h-[55vh] gap-2 overflow-y-auto px-1 md:gap-4">
          {/* Email */}
          <FormController
            form={form}
            name="email"
            label="Email Address"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="email"
                value={field.value as string}
                placeholder="Enter email"
                className={cn([isError ? "border-destructive" : ""])}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <FormController
              form={form}
              name="firstName"
              label="First Name"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  value={field.value as string}
                  placeholder="First name"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />

            {/* Last Name */}
            <FormController
              form={form}
              name="lastName"
              label="Last Name"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  value={field.value as string}
                  placeholder="Last name (optional)"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <FormController
              form={form}
              name="password"
              label={
                state.mode === "CREATE" ? "Password" : "New Password (optional)"
              }
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="password"
                  value={field.value as string}
                  placeholder={
                    state.mode === "CREATE"
                      ? "Enter password"
                      : "Leave blank to keep current"
                  }
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />

            {/* Role */}
            <FormController
              form={form}
              name="role"
              label="Role"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  id={field.name}
                  value={field.value as string}
                  className="w-full"
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  {rolesList.map((r) => (
                    <NativeSelectOption key={r.value} value={r.value}>
                      {r.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Salary */}
            <FormController
              form={form}
              name="salary"
              label="Salary"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  value={field.value as string}
                  placeholder="0.00"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />

            {/* Country */}
            <FormController
              form={form}
              name="countryId"
              label="Country"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  id={field.name}
                  value={field.value as string}
                  className="w-full"
                  onChange={(e) => onCountryChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="">
                    Select Country
                  </NativeSelectOption>
                  {countries.map((c) => (
                    <NativeSelectOption key={c.id} value={c.id}>
                      {c.flag} {c.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />

            {/* State */}
            <FormController
              form={form}
              name="stateId"
              label="State"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  id={field.name}
                  value={field.value as string}
                  className="w-full"
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  <NativeSelectOption value="">
                    {!selectedCountryId
                      ? "Select Country first"
                      : "Select State"}
                  </NativeSelectOption>
                  {filteredStates.map((s) => (
                    <NativeSelectOption key={s.id} value={s.id}>
                      {s.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Address */}
            <div className="col-span-2">
              <FormController
                form={form}
                name="address"
                label="Address"
                render={({ field, isError, ariaDescribedby }) => (
                  <Textarea
                    id={field.name}
                    value={field.value as string}
                    placeholder="Enter street address"
                    className={cn([isError ? "border-destructive" : ""])}
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-invalid={isError}
                    aria-describedby={ariaDescribedby}
                  />
                )}
              />
            </div>

            {/* Zip */}
            <FormController
              form={form}
              name="zip"
              label="Zip Code"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  value={field.value as string}
                  placeholder="Zip code"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>

          {/* Profile Image URL */}
          <FormController
            form={form}
            name="profileImage"
            label="Profile Image URL"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                value={field.value as string}
                placeholder="Enter image URL"
                className={cn([isError ? "border-destructive" : ""])}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
        </div>
        <DialogFooter className="mt-2">
          <DialogClose
            render={<Button variant="outline" data-testid="cancel-button" />}
          >
            Cancel
          </DialogClose>
          {state.mode === "CREATE" ? (
            <AsyncButton
              data-testid="create-button"
              loading={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
              loadingText="Creating..."
            >
              Create
            </AsyncButton>
          ) : (
            <AsyncButton
              data-testid="update-button"
              loading={form.formState.isSubmitting}
              onClick={form.handleSubmit(onUpdate)}
              type="submit"
              loadingText="Updating..."
            >
              Update
            </AsyncButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
