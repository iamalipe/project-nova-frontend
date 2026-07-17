import type { ProductType } from "@/api/product-api"
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
import { useState, useEffect, useMemo } from "react"
import DialogSkeleton from "./dialog-skeleton"
import DialogViewMode from "./dialog-view-mode"

const formSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().max(2000).optional(),
  subcategoryId: z.string().uuid("Please select a subcategory"),
  mrp: z.coerce.number().gt(0, "MRP must be greater than 0"),
  mop: z.coerce.number().gt(0, "MOP must be greater than 0"),
  images: z.string().url("Invalid image URL").optional().or(z.literal("")),
})
type FormSchemaType = z.infer<typeof formSchema>

export type ProductDialogProps = {
  state: DialogStateType
  data?: ProductType
}

const ProductDialog = ({ state }: ProductDialogProps) => {
  const productQuery = state.id ? apiQuery.product.useGet(state.id) : undefined
  const categoriesQuery = apiQuery.category.useGetAll({ page: 0 })
  const subcategoriesQuery = apiQuery.subcategory.useGetAll({ page: 0 })

  const { isLoading } = useQueryLoadingState(
    productQuery
      ? [productQuery, categoriesQuery, subcategoriesQuery]
      : [categoriesQuery, subcategoriesQuery]
  )

  if (isLoading) return <DialogSkeleton />
  if (state.mode === "VIEW")
    return <DialogViewMode state={state} data={productQuery?.data?.data} />

  return (
    <DialogMain
      state={state}
      data={productQuery?.data?.data}
      categories={categoriesQuery.data?.data || []}
      subcategories={subcategoriesQuery.data?.data || []}
    />
  )
}

export default ProductDialog

type DialogMainProps = ProductDialogProps & {
  categories: { id: string; name: string }[]
  subcategories: { id: string; name: string; categoryId: string }[]
}

const DialogMain = ({ data, state, categories, subcategories }: DialogMainProps) => {
  const navigate = useNavigate()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

  const defaultValues: FormSchemaType = {
    name: data?.name ?? "",
    subcategoryId: data?.subcategoryId ?? "",
    description: data?.description ?? "",
    mrp: data?.mrp ?? 0,
    mop: data?.mop ?? 0,
    images: data?.images ?? "",
  }

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormSchemaType>,
    defaultValues: defaultValues,
    mode: "onChange",
  })

  // Set initial category based on subcategory
  useEffect(() => {
    if (data?.subcategory?.categoryId) {
      setSelectedCategoryId(data.subcategory.categoryId)
    } else if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id)
    }
  }, [data, categories])

  // Automatically update the subcategoryId default value if starting fresh
  useEffect(() => {
    if (!state.id && selectedCategoryId && subcategories.length > 0) {
      const firstSub = subcategories.find(s => s.categoryId === selectedCategoryId)
      if (firstSub && !form.getValues("subcategoryId")) {
        form.setValue("subcategoryId", firstSub.id)
      }
    }
  }, [state.id, selectedCategoryId, subcategories, form])

  // Filter subcategories by selected category
  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((s) => s.categoryId === selectedCategoryId)
  }, [subcategories, selectedCategoryId])

  const onCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId)
    const matchingSubs = subcategories.filter((s) => s.categoryId === catId)
    if (matchingSubs.length > 0) {
      form.setValue("subcategoryId", matchingSubs[0].id, { shouldValidate: true })
    } else {
      form.setValue("subcategoryId", "", { shouldValidate: true })
    }
  }

  const generateFakeData = () => {
    if (subcategories.length === 0) return
    const randomSub = subcategories[Math.floor(Math.random() * subcategories.length)]
    setSelectedCategoryId(randomSub.categoryId)
    form.reset({
      name: faker.commerce.productName(),
      subcategoryId: randomSub.id,
      description: faker.commerce.productDescription(),
      mrp: Number(faker.commerce.price({ min: 50, max: 1000, dec: 2 })),
      mop: Number(faker.commerce.price({ min: 40, max: 900, dec: 2 })),
      images: faker.image.url(),
    })
  }

  const onClose = () => {
    form.reset()
    navigate({
      to: "/app/product",
      search: (prev) => ({
        ...prev,
        ds: undefined,
      }),
    })
  }

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const res = await apiQuery.product.create(values)
      if (!res.success) throw new Error("Something went wrong, please try again.")
      toast.success("Product added successfully.")
      onClose()
    } catch (err: any) {
      handleFormError({ form, error: err })
    }
  }

  const onUpdate = async (values: FormSchemaType) => {
    try {
      if (!state.id) throw new Error("No id found")
      const res = await apiQuery.product.update({
        id: state.id,
        data: values,
      })
      if (!res.success) throw new Error("Something went wrong, please try again.")

      toast.success("Product updated successfully.")
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
          <DialogTitle>Product</DialogTitle>
          <DialogDescription>
            Create or edit Product listings. SKU is auto-generated prefixing the parent Subcategory SKU.
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
        <div className="grid gap-2 md:gap-4 max-h-[55vh] overflow-y-auto pr-1">
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

          <div className="grid grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Category</label>
              <NativeSelect
                value={selectedCategoryId}
                className="w-full"
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                {categories.map((c) => (
                  <NativeSelectOption key={c.id} value={c.id}>
                    {c.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            {/* Subcategory selection */}
            <FormController
              form={form}
              name="subcategoryId"
              label="Subcategory"
              render={({ field, isError, ariaDescribedby }) => (
                <NativeSelect
                  id={field.name}
                  value={field.value as string}
                  name="subcategoryId"
                  className="w-full"
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                >
                  {filteredSubcategories.length === 0 && (
                    <NativeSelectOption value="">Select a category first</NativeSelectOption>
                  )}
                  {filteredSubcategories.map((s) => (
                    <NativeSelectOption key={s.id} value={s.id}>
                      {s.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* mrp */}
            <FormController
              form={form}
              name="mrp"
              label="MRP"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  value={field.value as string}
                  placeholder="Enter MRP"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
            {/* mop */}
            <FormController
              form={form}
              name="mop"
              label="MOP"
              render={({ field, isError, ariaDescribedby }) => (
                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  value={field.value as string}
                  placeholder="Enter MOP"
                  className={cn([isError ? "border-destructive" : ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={isError}
                  aria-describedby={ariaDescribedby}
                />
              )}
            />
          </div>

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
