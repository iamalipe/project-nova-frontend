import type { SubcategoryType } from "@/api/subcategory-api"
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
import { Textarea } from "@/components/ui/textarea"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import apiQuery from "@/hooks/use-api-query"
import useQueryLoadingState from "@/hooks/use-query-loading-state"
import { handleFormError } from "@/lib/form"
import { cn } from "@/lib/utils"
import type { DialogStateType } from "@/routes/private-admin/private-admin-route"
import { faker } from "@faker-js/faker"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { DicesIcon } from "lucide-react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import DialogSkeleton from "./dialog-skeleton"
import DialogViewMode from "./dialog-view-mode"

const formSchema = z.object({
  name: z.string().min(2).max(255),
  categoryId: z.string().uuid("Please select a category"),
  description: z.string().max(2000).optional(),
  images: z.string().url("Invalid image URL").optional().or(z.literal("")),
})
type FormSchemaType = z.infer<typeof formSchema>

export type SubcategoryDialogProps = {
  state: DialogStateType
  data?: SubcategoryType
}

const SubcategoryDialog = ({ state }: SubcategoryDialogProps) => {
  const subcategoryQuery = state.id ? apiQuery.subcategory.useGet(state.id) : undefined
  const categoriesQuery = apiQuery.category.useGetAll({ page: 0 })

  const { isLoading } = useQueryLoadingState(
    subcategoryQuery ? [subcategoryQuery, categoriesQuery] : [categoriesQuery]
  )

  if (isLoading) return <DialogSkeleton />
  if (state.mode === "VIEW")
    return <DialogViewMode state={state} data={subcategoryQuery?.data?.data} />

  return (
    <DialogMain
      state={state}
      data={subcategoryQuery?.data?.data}
      categories={categoriesQuery.data?.data || []}
    />
  )
}

export default SubcategoryDialog

type DialogMainProps = SubcategoryDialogProps & {
  categories: { id: string; name: string }[]
}

const DialogMain = ({ data, state, categories }: DialogMainProps) => {
  const navigate = useNavigate()

  const defaultValues: FormSchemaType = {
    name: data?.name ?? "",
    categoryId: data?.categoryId ?? (categories[0]?.id ?? ""),
    description: data?.description ?? "",
    images: data?.images ?? "",
  }

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues: defaultValues,
    mode: "onChange",
  })

  const generateFakeData = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    form.reset({
      name: faker.commerce.productMaterial(),
      categoryId: randomCategory?.id ?? "",
      description: faker.lorem.paragraph(),
      images: faker.image.url(),
    })
  }

  const onClose = () => {
    form.reset()
    navigate({
      to: "/app/subcategory",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const res = await apiQuery.subcategory.create(values)
      if (!res.success) throw new Error("Something went wrong, please try again.")
      toast.success("Subcategory added successfully.")
      onClose()
    } catch (err: any) {
      handleFormError({ form, error: err })
    }
  }

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) throw new Error("No id found")
      const res = await apiQuery.subcategory.update({
        id: state.id,
        data: values,
      })
      if (!res.success) throw new Error("Something went wrong, please try again.")

      toast.success("Subcategory updated successfully.")
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
      <DialogContent className="sm:max-h-[80vh] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Subcategory</DialogTitle>
          <DialogDescription>
            Create or edit Subcategory entries. SKU will be auto-generated prefixing the Category SKU.
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
          {/* category select */}
          <FormController
            form={form}
            name="categoryId"
            label="Category"
            render={({ field, isError, ariaDescribedby }) => (
              <NativeSelect
                id={field.name}
                value={field.value as string}
                name="categoryId"
                className="w-full"
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              >
                {categories.length === 0 && (
                  <NativeSelectOption value="">No categories available</NativeSelectOption>
                )}
                {categories.map((c) => (
                  <NativeSelectOption key={c.id} value={c.id}>
                    {c.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          />
          {/* name */}
          <FormController
            form={form}
            name="name"
            label="Name"
            render={({ field, isError, ariaDescribedby }) => (
              <Input
                id={field.name}
                type="text"
                data-testid="name-input"
                value={field.value as string}
                placeholder="Enter name"
                className={cn([isError ? "border-destructive" : ""])}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
          {/* images */}
          <FormController
            form={form}
            name="images"
            label="Image URL"
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
          {/* description */}
          <FormController
            form={form}
            name="description"
            label="Description"
            maxLength={2000}
            render={({ field, isError, ariaDescribedby }) => (
              <Textarea
                id={field.name}
                value={field.value as string}
                placeholder="Enter description"
                className={cn([isError ? "border-destructive" : ""])}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={isError}
                aria-describedby={ariaDescribedby}
              />
            )}
          />
        </div>
        <DialogFooter>
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
