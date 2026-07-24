import type { StateType } from "@/api/state-api"
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
import apiQuery from "@/hooks/use-api-query"
import useQueryLoadingState from "@/hooks/use-query-loading-state"
import { handleFormError } from "@/lib/form"
import { cn } from "@/lib/utils"
import { validateAndStringify } from "@/lib/generic-validation"
import { dialogStateZodSchema } from "../../private-admin-route"
import type { DialogStateType } from "@/routes/private-admin/private-admin-route"
import { faker } from "@faker-js/faker"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { DicesIcon } from "lucide-react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2).max(255),
  countryId: z.string().uuid("Please select a country"),
  subdivisionCode: z.string().min(1, "Subdivision code is required").max(10),
  tz: z.string().optional().nullable(),
  flag: z.string().optional().nullable(),
})
type FormSchemaType = z.infer<typeof formSchema>

export type StateDialogProps = {
  state: DialogStateType
  data?: StateType
}

const StateDialog = ({ state }: StateDialogProps) => {
  const stateQuery = state.id ? apiQuery.state.useGet(state.id) : undefined
  const countriesQuery = apiQuery.country.useGetAll({ page: 0 })

  const { isLoading } = useQueryLoadingState(
    stateQuery ? [stateQuery, countriesQuery] : [countriesQuery]
  )

  if (isLoading) return <DialogSkeleton />
  if (state.mode === "VIEW")
    return <DialogViewMode state={state} data={stateQuery?.data?.data} />

  return (
    <DialogMain
      state={state}
      data={stateQuery?.data?.data}
      countries={countriesQuery.data?.data || []}
    />
  )
}

export default StateDialog

const DialogSkeleton = () => {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-h-[80vh] sm:max-w-[600px] animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="h-4 w-full bg-muted rounded mb-2" />
        <div className="h-10 w-full bg-muted rounded mb-4" />
        <div className="h-10 w-full bg-muted rounded mb-4" />
        <div className="h-10 w-full bg-muted rounded mb-4" />
      </DialogContent>
    </Dialog>
  )
}

const DialogViewMode = ({ data }: StateDialogProps) => {
  const navigate = useNavigate()
  const onClose = () => {
    navigate({
      to: "/app/state",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onEdit = () => {
    if (!data) return
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "CountryState",
      id: data.id,
      mode: "UPDATE",
    })

    if (!ds) return
    navigate({
      to: "/app/state",
      search: (prev) => ({
        ...prev,
        ds: ds,
      }),
    })
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="flex flex-col overflow-hidden sm:max-h-[90vh] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>State Details</DialogTitle>
          <DialogDescription>
            View details for this State entry.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col overflow-auto px-2 gap-3 py-2">
          <ViewField label="Name" value={data?.name} />
          <ViewField label="Country" value={data?.country?.name} />
          <ViewField label="Subdivision Code (ISO 3166-2)" value={data?.subdivisionCode} />
          <ViewField label="Timezone" value={data?.tz} />
          <ViewField label="Flag" value={data?.flag} />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          {data && <Button onClick={onEdit}>Edit</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ViewField = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex justify-between border-b py-2 last:border-0">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold">{value || "-"}</span>
  </div>
)

type DialogMainProps = StateDialogProps & {
  countries: { id: string; name: string }[]
}

const DialogMain = ({ data, state, countries }: DialogMainProps) => {
  const navigate = useNavigate()

  const defaultValues: FormSchemaType = {
    name: data?.name ?? "",
    countryId: data?.countryId ?? (countries[0]?.id ?? ""),
    subdivisionCode: data?.subdivisionCode ?? "",
    tz: data?.tz ?? "",
    flag: data?.flag ?? "",
  }

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues: defaultValues,
    mode: "onChange",
  })

  const generateFakeData = () => {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)]
    form.reset({
      name: faker.location.state(),
      countryId: randomCountry?.id ?? "",
      subdivisionCode: faker.string.alpha(2).toUpperCase(),
      tz: faker.location.timeZone(),
      flag: faker.internet.emoji({ types: ["nature", "smiley", "activity"] }),
    })
  }

  const onClose = () => {
    form.reset()
    navigate({
      to: "/app/state",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const res = await apiQuery.state.create(values)
      if (!res.success) throw new Error("Something went wrong, please try again.")
      toast.success("State added successfully.")
      onClose()
    } catch (err: any) {
      handleFormError({ form, error: err })
    }
  }

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) throw new Error("No id found")
      const res = await apiQuery.state.update({
        id: state.id,
        data: values,
      })
      if (!res.success) throw new Error("Something went wrong, please try again.")

      toast.success("State updated successfully.")
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
      <DialogContent className="sm:max-h-[85vh] sm:max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>State</DialogTitle>
          <DialogDescription>
            Create or edit State entries.
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
        <div className="grid gap-2 md:gap-4">
          <FormController
            form={form}
            name="countryId"
            label="Country"
            render={({ field, isError, ariaDescribedby }) => (
              <NativeSelect
                id={field.name}
                value={field.value as string}
                name="countryId"
                className="w-full"
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              >
                {countries.length === 0 && (
                  <NativeSelectOption value="">No countries available</NativeSelectOption>
                )}
                {countries.map((c) => (
                  <NativeSelectOption key={c.id} value={c.id}>
                    {c.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          />
          <FormController
            form={form}
            name="name"
            label="Name"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                placeholder="Enter state name (e.g. California)"
                className={cn([isError ? "border-destructive" : ""])}
                value={field.value as string || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
          <FormController
            form={form}
            name="subdivisionCode"
            label="Subdivision Code (ISO 3166-2)"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                placeholder="e.g. CA or US-CA"
                className={cn([isError ? "border-destructive" : ""])}
                value={field.value as string || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
          <FormController
            form={form}
            name="tz"
            label="Timezone (Optional)"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                placeholder="e.g. America/Los_Angeles"
                className={cn([isError ? "border-destructive" : ""])}
                value={field.value as string || ""}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
          <FormController
            form={form}
            name="flag"
            label="Flag Emoji or URL (Optional)"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                placeholder="e.g. 🐻 or image URL"
                className={cn([isError ? "border-destructive" : ""])}
                value={field.value as string || ""}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
        </div>
        <DialogFooter className="mt-4">
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          {state.mode === "CREATE" ? (
            <AsyncButton
              loading={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
              loadingText="Creating..."
            >
              Create
            </AsyncButton>
          ) : (
            <AsyncButton
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
