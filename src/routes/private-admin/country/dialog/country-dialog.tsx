import type { CountryType } from "@/api/country-api"
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
  flag: z.string().min(1),
  code3: z.string().length(3),
  code2: z.string().length(2),
  tz: z.string().min(1),
  currency3: z.string().length(3),
  currencySymbol: z.string().min(1),
})
type FormSchemaType = z.infer<typeof formSchema>

export type CountryDialogProps = {
  state: DialogStateType
  data?: CountryType
}

const CountryDialog = ({ state }: CountryDialogProps) => {
  const countryQuery = state.id ? apiQuery.country.useGet(state.id) : undefined
  const { isLoading } = useQueryLoadingState(countryQuery ? [countryQuery] : [])

  if (isLoading) return <DialogSkeleton />
  if (state.mode === "VIEW")
    return <DialogViewMode state={state} data={countryQuery?.data?.data} />
  return <DialogMain state={state} data={countryQuery?.data?.data} />
}

export default CountryDialog

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

const DialogViewMode = ({ data }: CountryDialogProps) => {
  const navigate = useNavigate()
  const onClose = () => {
    navigate({
      to: "/app/country",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onEdit = () => {
    if (!data) return
    const ds = validateAndStringify(dialogStateZodSchema, {
      dialog: "Country",
      id: data.id,
      mode: "UPDATE",
    })

    if (!ds) return
    navigate({
      to: "/app/country",
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
          <DialogTitle>Country Details</DialogTitle>
          <DialogDescription>
            View details for this Country entry.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col overflow-auto px-2 gap-3 py-2">
          <ViewField label="Name" value={data?.name} />
          <ViewField label="Flag" value={data?.flag} />
          <ViewField label="ISO Code (3)" value={data?.code3} />
          <ViewField label="ISO Code (2)" value={data?.code2} />
          <ViewField label="Timezone" value={data?.tz} />
          <ViewField label="Currency Code" value={data?.currency3} />
          <ViewField label="Currency Symbol" value={data?.currencySymbol} />
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

const DialogMain = ({ data, state }: CountryDialogProps) => {
  const navigate = useNavigate()

  const defaultValues: FormSchemaType = {
    name: data?.name ?? "",
    flag: data?.flag ?? "",
    code3: data?.code3 ?? "",
    code2: data?.code2 ?? "",
    tz: data?.tz ?? "",
    currency3: data?.currency3 ?? "",
    currencySymbol: data?.currencySymbol ?? "",
  }

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues: defaultValues,
    mode: "onChange",
  })

  const generateFakeData = () => {
    form.reset({
      name: faker.location.country(),
      flag: faker.internet.emoji({ types: ["nature", "smiley", "activity"] }),
      code3: faker.location.countryCode("alpha-3"),
      code2: faker.location.countryCode("alpha-2"),
      tz: faker.location.timeZone(),
      currency3: faker.finance.currencyCode(),
      currencySymbol: faker.finance.currencySymbol(),
    })
  }

  const onClose = () => {
    form.reset()
    navigate({
      to: "/app/country",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const res = await apiQuery.country.create(values)
      if (!res.success) throw new Error("Something went wrong, please try again.")
      toast.success("Country added successfully.")
      onClose()
    } catch (err: any) {
      handleFormError({ form, error: err })
    }
  }

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) throw new Error("No id found")
      const res = await apiQuery.country.update({
        id: state.id,
        data: values,
      })
      if (!res.success) throw new Error("Something went wrong, please try again.")

      toast.success("Country updated successfully.")
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
          <DialogTitle>Country</DialogTitle>
          <DialogDescription>
            Create or edit Country entries.
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
            name="name"
            label="Name"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                placeholder="Enter country name (e.g. United States)"
                className={cn([isError ? "border-destructive" : ""])}
                {...field}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
          <FormController
            form={form}
            name="flag"
            label="Flag (Emoji or URL)"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                placeholder="Enter flag emoji or URL"
                className={cn([isError ? "border-destructive" : ""])}
                {...field}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="code3"
              label="ISO Code (3 letters)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  placeholder="USA"
                  maxLength={3}
                  className={cn([isError ? "border-destructive" : ""])}
                  {...field}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="code2"
              label="ISO Code (2 letters)"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  placeholder="US"
                  maxLength={2}
                  className={cn([isError ? "border-destructive" : ""])}
                  {...field}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>
          <FormController
            form={form}
            name="tz"
            label="Timezone"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                placeholder="e.g. America/New_York"
                className={cn([isError ? "border-destructive" : ""])}
                {...field}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormController
              form={form}
              name="currency3"
              label="Currency Code"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  placeholder="USD"
                  maxLength={3}
                  className={cn([isError ? "border-destructive" : ""])}
                  {...field}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            <FormController
              form={form}
              name="currencySymbol"
              label="Currency Symbol"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="text"
                  placeholder="$"
                  className={cn([isError ? "border-destructive" : ""])}
                  {...field}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>
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
